from flask import Flask, render_template
import numpy as np
import json

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():  # put application's code here

    action_simul_easy = np.load('one_die_simultaneous_easy_action.npy')
    action_simul_normal = np.load('one_dice_simul_vs25_action.npy')
    action_simul_hard = np.load('optimal_action.npy')
    action_sequential_easy = np.load('one_die_sequential_easy_action.npy')
    action_sequential_normal = np.load('one_die_sequential_normal_action.npy')
    action_sequential_hard = np.load('one_die_action.npy')

    json_array_simul_normal = json.dumps(action_simul_normal.tolist())
    json_array_simul_hard = json.dumps(action_simul_hard.tolist())
    json_array_simul_easy = json.dumps(action_simul_easy.tolist())
    json_array_sequential_easy = json.dumps(action_sequential_easy.tolist())
    json_array_sequential_normal = json.dumps(action_sequential_normal.tolist())
    json_array_sequential_hard = json.dumps(action_sequential_hard.tolist())

    return render_template('index2.html', simul_easy=json_array_simul_easy, simul_normal=json_array_simul_normal, simul_hard=json_array_simul_hard,
                           sequential_easy=json_array_sequential_easy, sequential_normal=json_array_sequential_normal, sequential_hard=json_array_sequential_hard)


if __name__ == '__main__':
    app.run()
