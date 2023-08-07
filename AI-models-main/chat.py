
import re
import os
import openai
import random
import json
import torch
import torch.nn as nn
import nltk
import numpy as np
import json
import numpy as np
from torch.utils.data import Dataset, DataLoader
from nltk.stem.porter import PorterStemmer
nltk.download('punkt')
stemmer = PorterStemmer()
# Flask
from dotenv import load_dotenv

# GTP-3 set up
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')
print(os.getenv('OPENAI_API_KEY'))
completion = openai.Completion()
start_sequence = "\nMoon:"
restart_sequence = "\nCustomer:"
session_prompt = "You are talking with an Bakery E-commerce assistant call Moon, Moon provide customer service to customer and solve customer doubt\n\nCustomer: Who are you?\n Moon: I am Moon.\n\nCustomer:can you tell me bakery address?\nMoon:Our Bakery Location is 3A-G-13D, Straits Quay, Jalan Seri Tg Pinang, Seri Tanjung Pinang, 10470 Tanjung Tokong, 10470 Penang, Malaysia."


def ask(question, chat_log=None):
    prompt_text = f'{chat_log}{restart_sequence} {question}{start_sequence}'
    try:
        response = openai.Completion.create(
            model="text-davinci-002",
            prompt=prompt_text,
            temperature=0.9,
            max_tokens=1000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0.6,
            # stop=["\n"],
            stop=["Customer:", "Moon:"]
        )
        story = response['choices'][0]['text']
        print(story)
        return str(re.sub('[!@#$?:]', '', story)).strip()
    except openai.error.RateLimitError:
        print("OpenAi RateLimitError is Handled!")


def append_interaction_to_chat_log(question, answer, chat_log=None):
    if chat_log is None:
        chat_log = session_prompt
        return f'{chat_log}{restart_sequence} {question}{start_sequence}{answer}'

# Train Model


def trainModel():
    with open('intends.json', 'r') as f:
        intends = json.load(f)

    all_words = []
    tags = []
    xy = []

    for intend in intends['intents']:
        tag = intend['tag']
        tags.append(tag)
        for pattern in intend['patterns']:
            w = tokenize(pattern)
            all_words.extend(w)
            xy.append((w, tag))

    ignore_words = ['?', '!', '.', ',']
    all_words = [stem(w) for w in all_words if w not in ignore_words]
    all_words = sorted(set(all_words))
    # print(xy)
    tags = sorted(set(tags))
    # print(all_words)
    # print(tags)

    X_train = []
    y_train = []

    for (pattern_sentence, tag) in xy:
        bag = bag_of_words(pattern_sentence, all_words)
        X_train.append(bag)

        label = tags.index(tag)
        y_train.append(label)  # CrossEntropyLoss

    X_train = np.array(X_train)
    y_train = np.array(y_train)

    class ChatDataset(Dataset):
        def __init__(self):
            self.n_samples = len(X_train)
            self.x_data = X_train
            self.y_data = y_train

        def __getitem__(self, idx):
            return self.x_data[idx], self.y_data[idx]

        def __len__(self):
            return self.n_samples

    batch_size = 8
    input_size = len(all_words)
    hidden_size = 8
    output_size = len(tags)
    learning_rate = 0.001
    num_epochs = 1500

    dataset = ChatDataset()
    train_loader = DataLoader(
        dataset=dataset, batch_size=batch_size, shuffle=True)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(device)
    model = NeuralNet(input_size, hidden_size, output_size)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    # Training loop
    for epoch in range(num_epochs):
        for (words, labels) in train_loader:
            words = words.to(device)
            labels = labels.to(dtype=torch.long).to(device)

            # forward
            outputs = model(words)
            loss = criterion(outputs, labels)

            # backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        if (epoch+1) % 100 == 0:
            print(f'Epoch {epoch+1}/{num_epochs}, Loss={loss.item():.4f}')
    print(f'final loss, loss={loss.item():.4f}')

    data = {
        "model_state": model.state_dict(),
        "input_size": input_size,
        "output_size": output_size,
        "hidden_size": hidden_size,
        "all_words": all_words,
        "tags": tags
    }

    file_name = "data.pth"
    torch.save(data, file_name)

    print(f'Training Complete. File saved to {file_name}')
    return

# NLTK data purify


def tokenize(sentence):
    return nltk.word_tokenize(sentence)


def stem(word):
    return stemmer.stem(word.lower())


def bag_of_words(tokenized_sentence, all_words):
    tokenized_sentence = [stem(w) for w in tokenized_sentence]

    bag = np.zeros(len(all_words), dtype=np.float32)
    for idx, w in enumerate(all_words):
        if w in tokenized_sentence:
            bag[idx] = 1.0
    return bag

# Neural Network algorithm


class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, hidden_size)
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        out = self.relu(out)
        out = self.l3(out)
        return out


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
with open('intends.json', 'r') as f:
    intents = json.load(f)
file_name = "data.pth"
data = torch.load(file_name)

input_size = data["input_size"]
output_size = data["output_size"]
hidden_size = data["hidden_size"]
all_words = data["all_words"]
tags = data["tags"]
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()
bot_name = "Moon"


def get_response(sentence):

    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.75:
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])
    return "I don't understand"




