import subprocess
import sys, os, shutil, json
from flask import Flask, request, abort
app = Flask(__name__)

baseDir = ''

def readConfig():
    global baseDir
    configName = 'config.my.json'
    configPath = os.path.join(scriptDir(), configName)
    if not os.path.exists(configPath):
        shutil.copyfile(os.path.join(scriptDir(), 'config.default.json'), configPath)
        print("Running for the first time: creating " + configName, file=sys.stderr)
    print("Reading " + configName, file=sys.stderr)
    with open(configPath, encoding="utf8") as configFile:
        configData = json.load(configFile)
    baseDir = configData['baseDir']
    if not os.path.exists(baseDir):
        print("Warning: Base directory '{}' does not exist, please edit config.my.json".format(baseDir), file=sys.stderr)

def scriptDir():
    return os.path.dirname(os.path.realpath(__file__))

@app.before_request
def limitToLocalhost():
    trusted = ['localhost', '127.0.0.1']
    if not request.remote_addr in trusted:
        abort(403)

@app.route('/')
def showPath():
    path = (baseDir + request.args.get('path')).replace('/', '\\')
    subprocess.call('explorer "{}"'.format(path), shell=True)
    return ''

@app.route('/edit/')
def editDatabase():
    path = os.path.join(scriptDir(), '..', 'database.js')
    os.system('start {}'.format(path))
    return ''

if __name__ == "__main__":
    readConfig()
    app.run(debug=False, port=7723)
