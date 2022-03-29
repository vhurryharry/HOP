from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from api.StockApiHandler import StockApiHandler

app = Flask(__name__)
CORS(app)  # comment this on deployment
api = Api(app)

api.add_resource(StockApiHandler, '/api/<string:symbol>')
