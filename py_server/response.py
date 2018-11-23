from flask import Flask, request, Response
from flask_cors import CORS
from numpy import genfromtxt
import numpy as np
import pandas as pd
from pyproj import Proj, transform
import json

df = pd.read_csv('v3.csv', header=None)
data = df.values
# print(np.shape(data))
pos = data[1:, 1:3]
val = data[1:, 3]
tag = data[1:, 4]
# print('pos shape' + str(np.shape(pos)))
# print('val shape' + str(np.shape(val)))
# print(val[:10])
print(tag[:10])
print(pos[:10])
app = Flask(__name__)
CORS(app)
inProj = Proj(init='epsg:32646')
outProj = Proj(init='epsg:4326')


def return_val(point):
    res = pos - point
    res_ = (np.abs(res[:, 0]) + np.abs(res[:, 1]))
    min_ind = np.argmin(res_)
    # res = {'val':str(val[min_ind]), 'canton':str(tag[min_ind])}

    return str(val[min_ind])


@app.route('/', methods=['POST', 'GET'])
def resvalue():
    print('In server')
    if request.method == 'POST':
        json_file = request.get_json(force=True)
        return return_val(np.asarray([json_file['lin'], json_file['lat']]))

    return 'fuck you'


if __name__ == '__main__':
    app.run()
