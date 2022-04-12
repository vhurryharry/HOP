# Stock Price Prediction App

This app predicts the prices of the next 15 days for the given stock using simple Python AI stuff.

The reasons for selecting this one for my HOP include:

- Learn the usage of Python AI related to real life stuff
- Learn how to implement the Flask API backend

## Tech Stack

- React.js/Typescript
- Flask
- Tensorflow (Keras)

## APIs/Libraries/Tools

- Yahoo Finance API (Stock price data)
- Blueprint.js (UI library)
- Recharts (chart library)
- SWR (Stale-While-Revalidate, API requests)
- Redis (Caching API responses)
- LSTM (Long Short-Term Memory) model (Prediction model)
- numpy, sklearn (Python libraries for data processing)

## How to run (local dev server)

- This project uses docker for Redis, so please make sure that the docker is running on your machine.

- Sign up for the Yahoo Finance API key [here](https://www.yahoofinanceapi.com/).
  Create a `.env` file from the `.env.template` file inside the `api` folder and add your API key.

        YAHOO_KEY=Your API Key

- Install dependencies and run the project.

        (api):  pip3 install -r requirements.txt
                docker-compose up -d --build
                flask run

        (app):  yarn
                yarn start
