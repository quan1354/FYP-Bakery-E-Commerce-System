## for machine learning
from sklearn import metrics, preprocessing
## for deep learning
from keras import models, layers, utils  #(2.6.0)
import string
import re
import json
from pandas import json_normalize
## for data
import pandas as pd
import numpy as np
import re
from datetime import datetime
import pandas as pd
import numpy as np
from nltk.corpus import stopwords
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer #Import TfIdfVectorizer from scikit-learn
from nltk.tokenize import RegexpTokenizer
import random
from PIL import Image
import requests
from io import BytesIO
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
# Import CountVectorizer and create the count matrix
from sklearn.feature_extraction.text import CountVectorizer
# Compute the Cosine Similarity matrix based on the count_matrix
from sklearn.metrics.pairwise import cosine_similarity

productData = ""
userData = ""

def makeRecommendation(data):
    global userData
    global productData
    dtf_products = json_normalize(data['product']) 
    dtf_users = json_normalize(data['user']) 

    dtf_products = dtf_products[~dtf_products["tag"].isna()]
    dtf_products["product"] = range(0,len(dtf_products))

    # User
    dtf_users["user"] = dtf_users["userId"].apply(lambda x: x-1)
    dtf_users = dtf_users.merge(dtf_products[["breadId","product","category"]], how="left")
    dtf_users = dtf_users.rename(columns={"rating":"y"})
    productData = dtf_products
    userData = dtf_users

    # select only useful column
    dtf_products = dtf_products[["product","name","tag"]].set_index("product")
    dtf_users = dtf_users[["user","product","y"]]

    # create the Products-Features matrix
    tags = [i.split(",") for i in dtf_products["tag"].unique()]
    columns = list(set([i for lst in tags for i in lst]))
    for col in columns:
        dtf_products[col] = dtf_products["tag"].apply(lambda x: 1 if col in x else 0)

    # The sparsity gets even worse with the Users-Products matrix:
    tmp = dtf_users.copy()
    dtf_users = tmp.pivot_table(index="user", columns="product", values="y")
    missing_cols = list(set(dtf_products.index) - set(dtf_users.columns))
    for col in missing_cols:
        dtf_users[col] = np.nan
    dtf_users = dtf_users[sorted(dtf_users.columns)]

    # Preprocessing and Scaling the data
    dtf_users = pd.DataFrame(preprocessing.MinMaxScaler(feature_range=(0.5,1)).fit_transform(dtf_users.values), 
    columns=dtf_users.columns, index=dtf_users.index)
    dtf_users

    # Split Data
    split = int(0.5*dtf_users.shape[1])
    dtf_train = dtf_users.loc[:, :split-1]
    dtf_test = dtf_users.loc[:, split:]

    # i = data['currentUser']
    i=data['currentUser'] -1
    train = dtf_train.iloc[i].to_frame(name="y")
    test = dtf_test.iloc[i].to_frame(name="y")
    #add all the test products but hide the y
    tmp = test.copy()
    tmp["y"] = np.nan
    train = pd.concat([train, tmp])
    #estimate the weights that the user gives to each feature. We have User-Products vector and the Products-Features matrix. model/shapes
    usr = train[["y"]].fillna(0).values.T
    prd = dtf_products.drop(["name","tag"],axis=1).values

    '''
        multiplying 2 objects, obtain User-Features vector containing estimated weights this user gives to each feature. 
        Those weights shall be re-applied to the Products-Features matrix in order to get the predicted ratings.
    '''
    ## usr_ft(users,fatures) = usr(users,products) x prd(products,features)
    usr_ft = np.dot(usr, prd)
    ## normalize
    weights = usr_ft / usr_ft.sum()
    ## predicted rating(users,products) = weights(users,fatures) x prd.T(features,products)
    pred = np.dot(weights, prd.T)
    test = test.merge(pd.DataFrame(pred[0], columns=["yhat"]), how="left", left_index=True, right_index=True).reset_index()
    test = test[~test["y"].isna()]
    predicted = test.sort_values("yhat", ascending=False)["product"].values[:3]
    return predicted

def favourite():
    global userData
    dtf_frequent = userData[userData['y'] > 3] 
    if dtf_frequent.size > 0:
        dtf_frequent  = dtf_frequent.category.mode()
        preferType = dtf_frequent[0]
        favourite = userData[userData['category']==preferType].sort_values(by='y',ascending = False).head(3)[['product','category','y']]
        favourite = favourite["product"].values[:3]
    return favourite

def topRate():
    global userData
    global productData
     # pre processing
    vote_count = (userData.groupby('breadId',as_index=False).agg( {'userId':'count', 'y':'mean'} )
        )
    vote_count.columns = ['breadId', 'vote_count', 'avg_rating']
    
    # calcuate input parameters
    C = np.mean(vote_count['avg_rating'])
    m = np.percentile(vote_count['vote_count'], 70)
    vote_count = vote_count[vote_count['vote_count'] >= m]
    R = vote_count['avg_rating']
    v = vote_count['vote_count']
    vote_count['weighted_rating'] = ( (v / (v + m)) * R) + ( (m / (v + m)) * C )
    
    # post processing
    vote_count = vote_count.merge(productData, on = ['breadId'], how = 'left')
    popular_items = vote_count.loc[:,['breadId','product', 'tag', 'vote_count', 'avg_rating', 'weighted_rating']]
    popular_items = popular_items.sort_values('weighted_rating', ascending = False)
    popular = popular_items['product'].values[:3]
    print(popular)
    return popular

# ?? imgUrl
def suggestSimilar(data):
    dtf_products = json_normalize(data['product']) 
    dtf_products["product"] = range(0,len(dtf_products))
    
    dtf_products['word_count'] = dtf_products['description'].apply(lambda x: len(str(x).split()))# Plotting the word count
    dtf_products['description'] = dtf_products['description'].dropna(axis=0)
    dtf_products['category'] = dtf_products['category'].replace("",np.nan)
    dtf_products['name'] = dtf_products['name'].replace("",np.nan)

    #Replace NaN with an empty string
    dtf_products['category'] = dtf_products['category'].fillna('none')
    dtf_products['name'] = dtf_products['name'].fillna('none')
    dtf_products['tag'] = dtf_products['tag'].str.join(" ")
    print(dtf_products)
    #Applying all the functions in description and storing as a cleaned_desc
    dtf_products['description'] = dtf_products['description'].apply(func = make_lower_case)
    dtf_products['description'] = dtf_products['description'].apply(func=_removeNonAscii)
    dtf_products['description'] = dtf_products['description'].apply(func=remove_punctuation)
    dtf_products['description'] = dtf_products['description'].apply(func=remove_html)

    dtf_products['category'] = dtf_products['category'].apply(func = make_lower_case)
    dtf_products['category'] = dtf_products['category'].apply(func=_removeNonAscii)
    dtf_products['category'] = dtf_products['category'].apply(func=remove_punctuation)
    dtf_products['category'] = dtf_products['category'].apply(func=remove_html)

    dtf_products['tag'] = dtf_products['tag'].apply(func = make_lower_case)
    dtf_products['tag'] = dtf_products['tag'].apply(func=_removeNonAscii)
    dtf_products['tag'] = dtf_products['tag'].apply(func=remove_punctuation)
    dtf_products['tag'] = dtf_products['tag'].apply(func=remove_html)

    # #Converting text descriptions into vectors using TF-IDF using Bigram or Trigram
    # tf = TfidfVectorizer(ngram_range=(2, 2), stop_words='english', lowercase = False)
    # tfidf_matrix = tf.fit_transform(dtf_products['description'])
    # total_words = tfidf_matrix.sum(axis=0) 
    # #Finding the word frequency
    # freq = [(word, total_words[0, idx]) for word, idx in tf.vocabulary_.items()]
    # freq =sorted(freq, key = lambda x: x[1], reverse=True)
    # #converting into dataframe 
    # bigram = pd.DataFrame(freq)
    # #trigram = pd.DataFrame(freq)
    # bigram.rename(columns = {0:'bigram', 1: 'count'}, inplace = True)

    dtf_products['item_name'] = dtf_products['name']
    dtf_products['item_name'] = dtf_products['item_name'].apply(func = make_lower_case)
    dtf_products['item_name'] = dtf_products['item_name'].apply(func=remove_punctuation)
    dtf_products['item_name'] = dtf_products['item_name'].apply(func=remove_html)
    dtf_products["text"]=  dtf_products['description'] + ' '+ dtf_products['item_name'] + ' ' + dtf_products['category'] + ' ' + dtf_products['tag']
    df_shop= dtf_products[['name','text','product']]

    #Converting text descriptions into vectors using TF-IDF
    tf = TfidfVectorizer(ngram_range=(2, 2), stop_words='english', lowercase = False)
    tfidf_matrix = tf.fit_transform(df_shop['text'])
    total_words = tfidf_matrix.sum(axis=0) 
    total_words
    #Define a TF-IDF Vectorizer Object. Remove all english stop words such as 'the', 'a'
    tfidf = TfidfVectorizer(stop_words='english')
    #Construct the required TF-IDF matrix by fitting and transforming the data
    tfidf_matrix = tfidf.fit_transform(df_shop['text'])
    #Output the shape of tfidf_matrix
    tfidf_matrix.shape
    #Compute the cosine similarity matrix
    #cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    tfidf.get_feature_names_out()[0:1000]
    #Construct a reverse map of indices and movie titles
    indices = pd.Series(dtf_products.index, index=df_shop['name']).drop_duplicates()

    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(df_shop['text'])
    count_matrix.shape

    cosine_sim2 = cosine_similarity(count_matrix, count_matrix)
    # # Reset index of your main DataFrame and construct reverse mapping as before
    # dtf_products = dtf_products.reset_index()
    # indices = pd.Series(dtf_products.index, index=dtf_products['name'])
    similar = get_recommendations(data['name'], data['category'], cosine_sim2, indices,df_shop)
    # similar = get_recommendations('Flaxseed & Chiaseed Loaf', 'Loaf', cosine_sim2, indices,df_shop)
    similar = similar['product'].values
    return similar

#Cleaning the the category and tags column
def clean_data(x):
        if isinstance(x, list): 
            return [str.lower(i.replace("|", ",")) for i in x]             
        else: 
            #Check if director exists. If not, return empty string          
            if isinstance(x, str):
                return str.lower(x.replace(">", ","))          
            else:           
                return '' 
# Function for removing NonAscii characters in the description column
def _removeNonAscii(s):
    return "".join(i for i in s if  ord(i)<128)

# Function for converting into lower case
def make_lower_case(text):
    return text.lower()


# Function for removing punctuation
def remove_punctuation(text):
    tokenizer = RegexpTokenizer(r'\w+')
    text = tokenizer.tokenize(text)
    text = " ".join(text)
    return text

# Function for removing the html tags
def remove_html(text):
    html_pattern = re.compile('<.*?>')
    return html_pattern.sub(r'', text)   

# Function that takes in item title as input and outputs most similar products
def get_recommendations(TITLE,Tags, cosine_sim,indices,df_shop):
    # Get the index of the items that matches the title
    idx = indices[TITLE]

    # Get the pairwsie similarity scores of all items
    sim_scores = list(enumerate(cosine_sim[idx])) # Sort the items
    #Sort the products based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 5 most similar items
    sim_scores = sim_scores[1:5]# Item indicies, Get the items indices
    shop_indices = [i[0] for i in sim_scores]

    # It reads the top 5 recommended Items titles 
    rec= df_shop[['name','product']].iloc[shop_indices] 
    return rec