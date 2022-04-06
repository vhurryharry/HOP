from flask_restful import Resource
import os
import requests

from predictor.predictor import predict, train


class StockApiHandler(Resource):
    def get_train(self, symbol):
        url = "https://yfapi.net/v8/finance/chart/{}".format(symbol)
        queryString = {"range": "10y",
                       "interval": "1d",
                       "indicators": "quote"}
        headers = {
            'x-api-key': os.environ['YAHOO_KEY']
        }

        response = requests.request(
            'GET', url, headers=headers, params=queryString)

        if response.status_code == requests.codes.ok:
            data = response.json()

            timestamps = data["chart"]["result"][0]["timestamp"]
            prices = data["chart"]["result"][0]["indicators"]["quote"][0]["close"]
            train(prices)
            predictions = predict(prices)
        else:
            timestamps = []
            prices = []
            predictions = []

        return {
            'symbol': symbol,
            'timestamps': timestamps[-365:],
            'prices': prices[-365:],
            'predictions': predictions
        }

    def get(self, symbol):
        url = "https://yfapi.net/v8/finance/chart/{}".format(symbol)
        queryString = {"range": "10y",
                       "interval": "1d",
                       "indicators": "quote"}
        headers = {
            'x-api-key': os.environ['YAHOO_KEY']
        }

        response = requests.request(
            'GET', url, headers=headers, params=queryString)

        if response.status_code == requests.codes.ok:
            data = response.json()

            timestamps = data["chart"]["result"][0]["timestamp"]
            prices = data["chart"]["result"][0]["indicators"]["quote"][0]["close"]
            predictions = predict(prices)
        else:
            timestamps = []
            prices = []
            predictions = []

        return {
            'symbol': symbol,
            'timestamps': timestamps[-365:],
            'prices': prices[-365:],
            'predictions': predictions
        }
