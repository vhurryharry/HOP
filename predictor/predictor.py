import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout


def create_dataset(df):
    x = []
    y = []
    for i in range(50, df.shape[0]):
        x.append(df[i-50:i, 0])
        y.append(df[i, 0])
    x = np.array(x)
    y = np.array(y)
    return x, y


def train(prices):
    df = pd.DataFrame({"price": prices})
    df = df['price'].values
    df = df.reshape(-1, 1)

    dataset_train = np.array(df[:int(df.shape[0]*0.8)])
    dataset_test = np.array(df[int(df.shape[0]*0.8):])

    scaler = MinMaxScaler(feature_range=(0, 1))
    dataset_train = scaler.fit_transform(dataset_train)
    dataset_test = scaler.transform(dataset_test)

    x_train, y_train = create_dataset(dataset_train)
    x_test, y_test = create_dataset(dataset_test)

    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    model = Sequential()
    model.add(LSTM(units=96, return_sequences=True,
              input_shape=(x_train.shape[1], 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=96, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(units=96, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(units=96))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))

    model.compile(loss='mean_squared_error', optimizer='adam')

    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    model.fit(x_train, y_train, epochs=100, batch_size=32)
    model.save('stock_prediction.h5')


def predict(prices):

    df = pd.DataFrame({"price": prices})
    df = df['price'].values
    df = df.reshape(-1, 1)

    dataset = np.array(df[:])

    scaler = MinMaxScaler(feature_range=(0, 1))
    dataset = scaler.fit_transform(dataset)

    model = load_model('stock_prediction.h5')

    predictions = model.predict(dataset)
    predictions = scaler.inverse_transform(predictions)

    return predictions[:, 0].tolist()
