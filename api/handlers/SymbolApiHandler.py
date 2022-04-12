from flask_restful import Resource
import os
import requests
from common.extensions import cache

class SymbolApiHandler(Resource):
    @cache.cached(timeout=60 * 60 * 24, query_string=True)
    def get(self, query):
        url = "https://yfapi.net/v6/finance/autocomplete"
        queryString = {"query": query,
                       "lang": "en"}
        headers = {
            'x-api-key': os.environ['YAHOO_KEY']
        }

        response = requests.request(
            'GET', url, headers=headers, params=queryString)

        if response.status_code == requests.codes.ok:
            data = response.json()

            return data["ResultSet"]["Result"]
        else:
            return []
