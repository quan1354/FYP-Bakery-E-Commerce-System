from json import encoder
from flask import jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask import Flask, request, session
from chat import get_response, ask, append_interaction_to_chat_log, trainModel
from recommend import makeRecommendation, favourite, topRate, suggestSimilar
import json
import numpy as np
from json import JSONEncoder
#Flask set up
app = Flask(__name__)
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
api = Api(app)
CORS(app)


@app.route("/answer", methods=['POST', 'GET'])
def answer():
    question = request.form.get("question")
    chat_log = session.get('chat_log')
    result = get_response(question)
    if result == "I don't understand":
        result = ask(question, chat_log)
        session['chatlog'] = append_interaction_to_chat_log(
            question, result, chat_log)
    if result is None or result == "":
        result = "I dont know"
    return jsonify({"question": question, "answer": result})


@app.route("/recommend", methods=['POST', 'GET'])
def recommend():
    # data = {
    #     "product": [
    #         {"breadId": 1, "imgUrl": "https://www.shutterstock.com/image-photo/large-thick-industrial-black-metal-chain-1081708619", "description": "this is a bread", "category": "Loaf",
    #             "price": 12.50, "name": 'Brown Rice Milk Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, filtered water, oil, sugar, natural sea salt'},
    #         {"breadId": 2, "imgUrl": "", "description": "this is a strawberry", "category": "Loaf", "price": 5.50, "name": 'Wholemeal Loaf',
    #             "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, wholemeal flour, filtered water, oil, sugar, natural sea salt, oat'},
    #         {"breadId": 3, "imgUrl": "https://www.shutterstock.com/image-photo/set-shortlink-welded-chain-zinc-plated-2133469857", "description": "this is a monster", "category": "Loaf",
    #             "price": 8.00, "name": 'Wholemeal Raisin Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, wholemeal flour, filtered water, raisin, oil, sugar, natural sea salt'},
    #         {"breadId": 4, "imgUrl": "https://www.shutterstock.com/image-illustration/background-silver-metal-chain-common-shortlink-2157127707", "description": "cat", "category": "Loaf", "price": 18.50,
    #             "name": 'Flaxseed & Chiaseed Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, filtered water, oil, wholemeal flour, sugar, flaxseed, chia seed, natural sea salt.'},
    #         {"breadId": 5, "imgUrl": "https://www.shutterstock.com/image-vector/peace-symbol-made-common-metal-short-2161215447", "description": "", "category": "Loaf", "price": 19.00,
    #             "name": 'Olive Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, filtered water, rice milk, olive oil, black olive, sugar, natural sea salt, black pepper, basil herb'},
    #         {"breadId": 6, "imgUrl": "", "description": "hello", "category": "Baguette", "price": 11.00,
    #             "name": 'Classic Baguette', "tag": 'Baguette,Unbleached wheat flour, leaven,filtered water, natural sea salt'},
    #         {"breadId": 7, "imgUrl": "", "description": "love", "category": "Baguette", "price": 5.50, "name": 'Spelt Baguette',
    #             "tag": 'Baguette,Unbleached wheat flour, leaven, filtered water, spelt flour, wholemeal flour, natural sea salt.'},
    #         {"breadId": 8, "imgUrl": "https://www.shutterstock.com/image-vector/url-shortener-man-pushes-address-bar-2201694049", "description": "hamster", "category": "Baguette",
    #             "price": 9.50, "name": 'Wholemeal Baguette', "tag": 'Baguette,Unbleached wheat flour, leaven, filtered water, wholemeal flour, natural sea salt'},
    #         {"breadId": 9, "imgUrl": "", "description": "", "category": "Baguette", "price": 7.00, "name": 'Rye Baguette',
    #             "tag": 'Baguette,Unbleached wheat flour, leaven, filtered water, rye flour, natural sea salt'},
    #         {"breadId": 10, "imgUrl": "", "description": "", "category": "Country", "price": 22.50, "name": 'Country Bread',
    #             "tag": 'Country,Unbleached wheat flour, leaven, filtered water, wholemeal flour, rye flour, natural sea salt'}
    #     ],
    #     "user": [
    #         # {"userId": 1, "breadId": 1, "rating": 1},
    #         # {"userId": 1, "breadId": 2, "rating": 1},
    #         # {"userId": 1, "breadId": 3, "rating": 5},
    #         # {"userId": 1, "breadId": 4, "rating": 2},
    #         # {"userId": 1, "breadId": 5, "rating": 2},
    #         # {"userId": 1, "breadId": 6, "rating": 5},
    #         # {"userId": 1, "breadId": 7, "rating": 5},
    #         # {"userId": 1, "breadId": 8, "rating": 3},
    #         # {"userId": 1, "breadId": 9, "rating": 3},
    #         # {"userId": 1, "breadId": 10, "rating": 5},
    #     ],
    # }
    data = json.loads(request.data)
    if len(data['user']) == 0:
        predicted = np.array([])
        favouriteProd = np.array([])
        topRateProd = np.array([])
        print("Here")
    else:
        predicted = makeRecommendation(data) 
        favouriteProd = favourite()
        topRateProd = topRate()
    return jsonify({"recommend": predicted.tolist(),"favourite": favouriteProd.tolist(),"topRate":topRateProd.tolist()})

@app.route("/similarProd", methods=['POST','GET'])
def similarProd():
    # data = {
    #     "product": [
    #         {"breadId": 1, "imgUrl": "https://www.shutterstock.com/image-photo/large-thick-industrial-black-metal-chain-1081708619", "description": "ssss", "category": "Loaf",
    #             "price": 12.50, "name": 'Brown Rice Milk Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, filtered water, oil, sugar, natural sea salt'},
    #         {"breadId": 2, "imgUrl": "", "description": "ssss", "category": "Loaf", "price": 5.50, "name": 'Wholemeal Loaf',
    #             "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, wholemeal flour, filtered water, oil, sugar, natural sea salt, oat'},
    #         {"breadId": 3, "imgUrl": "https://www.shutterstock.com/image-photo/set-shortlink-welded-chain-zinc-plated-2133469857", "description": "123", "category": "Loaf",
    #             "price": 8.00, "name": 'Wholemeal Raisin Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, wholemeal flour, filtered water, raisin, oil, sugar, natural sea salt'},
    #         {"breadId": 4, "imgUrl": "https://www.shutterstock.com/image-illustration/background-silver-metal-chain-common-shortlink-2157127707", "description": "123", "category": "Loaf", "price": 18.50,
    #             "name": 'Flaxseed & Chiaseed Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, rice milk, filtered water, oil, wholemeal flour, sugar, flaxseed, chia seed, natural sea salt.'},
    #         {"breadId": 5, "imgUrl": "https://www.shutterstock.com/image-vector/peace-symbol-made-common-metal-short-2161215447", "description": "", "category": "Loaf", "price": 19.00,
    #             "name": 'Olive Loaf', "tag": 'loaf,Unbleached wheat flour, leaven, filtered water, rice milk, olive oil, black olive, sugar, natural sea salt, black pepper, basil herb'},
    #         {"breadId": 6, "imgUrl": "", "description": "123", "category": "Baguette", "price": 11.00,
    #             "name": 'Classic Baguette', "tag": 'Baguette,Unbleached wheat flour, leaven,filtered water, natural sea salt'},
    #         {"breadId": 7, "imgUrl": "", "description": "123", "category": "Baguette", "price": 5.50, "name": 'Spelt Baguette',
    #             "tag": 'Baguette,Unbleached wheat flour, leaven, filtered water, spelt flour, wholemeal flour, natural sea salt.'},
    #         {"breadId": 8, "imgUrl": "https://www.shutterstock.com/image-vector/url-shortener-man-pushes-address-bar-2201694049", "description": "hamster", "category": "Baguette",
    #             "price": 9.50, "name": 'Wholemeal Baguette', "tag": 'Baguette,Unbleached wheat flour, leaven, filtered water, wholemeal flour, natural sea salt'},
    #         {"breadId": 9, "imgUrl": "", "description": "", "category": "Baguette", "price": 7.00, "name": 'Rye Baguette',
    #             "tag": 'Baguette,Unbleached wheat flour, leaven, filtered water, rye flour, natural sea salt'},
    #         {"breadId": 10, "imgUrl": "", "description": "", "category": "Country", "price": 22.50, "name": 'Country Bread',
    #             "tag": 'Country,Unbleached wheat flour, leaven, filtered water, wholemeal flour, rye flour, natural sea salt'}
    #     ],
    # }
    data = json.loads(request.data)
    similar = suggestSimilar(data)
    print(similar)
    return jsonify({"similar": similar.tolist()})

if __name__ == "__main__":
    # trainModel()
    app.debug = True
    app.run(port=5002)
