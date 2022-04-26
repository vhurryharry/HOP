import numpy as np
from sklearn.preprocessing import MinMaxScaler
import datetime as dt


def predict(prices):
    train_data = np.reshape(prices, (-1, 1))

    scaler = MinMaxScaler(feature_range=(0, 1))

    # Train the Scaler with training data and smooth data
    smoothing_window_size = 1000
    for di in range(0, train_data.shape[0], smoothing_window_size):
        scaler.fit(train_data[di:di + smoothing_window_size, :])
        train_data[di:di + smoothing_window_size,
                   :] = scaler.transform(train_data[di:di + smoothing_window_size, :])

    if di < train_data.shape[0]:
        # Normalize the last bit of remaining data
        scaler.fit(train_data[di:, :])
        train_data[di:, :] = scaler.transform(train_data[di:, :])

    # Reshape the data back to the shape of [data_size]
    train_data = train_data.reshape(-1)

    # Now perform exponential moving average smoothing
    # So the data will have a smoother curve than the original ragged data
    EMA = 0.0
    gamma = 0.1
    for ti in range(train_data.shape[0]):
        EMA = gamma*train_data[ti] + (1-gamma)*EMA
        train_data[ti] = EMA

    return ema(train_data)


def standard_average(train_data):
    window_size = 100
    N = train_data.size
    std_avg_predictions = []
    mse_errors = []

    for pred_idx in range(window_size, N):
        std_avg_predictions.append(
            np.mean(train_data[pred_idx-window_size:pred_idx]))
        mse_errors.append((std_avg_predictions[-1]-train_data[pred_idx])**2)

    print('MSE error for standard averaging: %.5f' % (0.5*np.mean(mse_errors)))

    return std_avg_predictions


def ema(train_data):
    N = train_data.size

    run_avg_predictions = []
    mse_errors = []

    running_mean = 0.0
    run_avg_predictions.append(running_mean)

    decay = 0.5

    for pred_idx in range(1, N):
        running_mean = running_mean*decay + (1.0-decay)*train_data[pred_idx-1]
        run_avg_predictions.append(running_mean)
        mse_errors.append((run_avg_predictions[-1]-train_data[pred_idx])**2)

    print('MSE error for EMA averaging: %.5f' % (0.5*np.mean(mse_errors)))

    return run_avg_predictions
