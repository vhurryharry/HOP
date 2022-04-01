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
    df = np.reshape(prices, (-1, 1))

    scaler = MinMaxScaler(feature_range=(0, 1))
    dataset_train = scaler.fit_transform(df)

    x_train, y_train = create_dataset(dataset_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

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

    model.fit(x_train, y_train, epochs=150, batch_size=32)
    model.save('stock_prediction.h5')


def predict_once(prices):
    df = np.reshape(prices, (-1, 1))

    scaler = MinMaxScaler(feature_range=(0, 1))
    dataset = scaler.fit_transform(df)

    x, y = create_dataset(dataset)

    model = load_model('stock_prediction.h5')

    pd = model(x)
    pd = scaler.inverse_transform(pd)

    return pd[:, 0].tolist()


def predict(prices):
    pd = predict_once(prices[-365 - 50:])

    lastPrices = prices[-51:]
    for day in range(0, 15):
        spd = predict_once(lastPrices)

        lastPrices.append(spd[0])
        lastPrices.pop(0)

    return pd + lastPrices[-15:]
