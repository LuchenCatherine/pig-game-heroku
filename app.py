from flask import Flask, render_template
import numpy as np
import json

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():  # put application's code here

    action = np.load('one_die_action.npy')
    action_simul_normal = np.load('one_dice_simul_vs25_action.npy')
    action_simul_hard = np.load('optimal_action.npy')
    json_array = json.dumps(action.tolist())
    json_array_simul_normal = json.dumps(action_simul_normal.tolist())
    json_array_simul_hard = json.dumps(action_simul_hard.tolist())
    return render_template('index2.html', data=json_array, normal=json_array_simul_normal, hard=json_array_simul_hard)


if __name__ == '__main__':
    app.run()
