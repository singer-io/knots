## Running locally

### Clone the repository

```bash
git clone https://github.com/datadotworld/knot.git
cd knot
```

### Set up Python

Install Python 3

```bash
brew install python3
```

Install `pip`

```bash
sudo easy_install pip
```

Install `virtualenv`

```bash
sudo pip install virtualenv
```

Create a virtual environment for the app to run in

```bash
virtualenv --python=/usr/local/bin/python3 env
source env/bin/activate
```

Install app requirements

```
pip install -r requirements.txt
```

### Run the app

From the root directory:

```bash
python3 manage.py runserver
```

Access the app at `http://127.0.0.1:8000/`

### Run in development mode

Install frontend dependencies

```bash
cd frontend
yarn
```

Run the app in watch mode

```bash
python3 manage.py runserver
```

On a different terminal

```bash
yarn start
```

Access the app at `http://localhost:3000/`
