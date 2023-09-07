# Spit-sh

Spit-sh is an open-source URL shortener project that provides the ability to shorten URLs, track clicks, and generate QR codes for the links. It consists of a FastAPI backend and a Next.js frontend.

## Getting Started

To set up and run the Spit-sh project locally, follow these steps:

### Backend

1. Clone the Spit-sh repository:

   ```bash
   git clone https://github.com/your-username/spit-sh.git
   ```

2. Go the backend directory:
   ```bash
   cd be
   ```

3. Set up the backend:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. Install the dependencies using Yarn:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:

   ```bash
   uvicorn app.main:app --reload
   ```

#### Backend dependencies

[FastAPI](https://fastapi.tiangolo.com "FastAPI") for api server<br>
[Uvicorn](https://www.uvicorn.org/ "uvicorn") - Python ASGI web server<br>
[SQLmodel](https://sqlmodel.tiangolo.com/ "sqlmodel") ORM platform built on SQLAlchemy<br>
[asyncpg](https://sqlmodel.tiangolo.com/ "asyncpg") Async driver for Postgres<br>
[Ip2geotools](https://pypi.org/project/ip2geotools/ "Ip2geotools") for geolocationing<br>
[Resend Python SDK](https://resend.com/docs/send-with-python "resend") for sending emails<br>
[python-dotenv](https://pypi.org/project/python-dotenv/ "python-dotenv") for parsing envvironment variables<br>
[Alembic](https://alembic.sqlalchemy.org/en/latest/ "alembic") for database migrations<br>
[fastapi-login](https://fastapi-login.readthedocs.io "fastapi-login") - Auth manager

### Frontend

1. Open a new terminal window/tab.

2. Navigate to the frontend directory:

   ```bash
   cd spit-sh/frontend
   ```

3. Install the dependencies using Yarn:

   ```bash
   yarn
   ```

4. Start the frontend development server:

   ```bash
   yarn dev
   ```

   This will start the Next.js development server and automatically open the Spit-sh application in your default browser.

## Usage

Once you have both the backend and frontend servers running, you can access the Spit-sh URL shortener application in your browser.

1. Open your web browser and navigate to `http://localhost:3000` if it doesn't open automatically.

2. You will see the Spit-sh homepage with the list of shortened links and an option to shorten a new URL.

3. To shorten a URL:

   - Enter the original URL in the input field.
   - Click the "Shorten" button.
   - The shortened URL will be displayed below with an associated QR code.

4. To track clicks:

   - Click on a shortened URL from the list.
   - You will be redirected to the details page for that URL.
   - The details page will show the number of clicks and a list of all the clicks with timestamps.

5. To generate a QR code:
   - Click on the QR code icon next to a shortened URL.
   - A modal will appear with the QR code for that URL.

## Conclusion

Congratulations! You have successfully set up the Spit-sh URL shortener project. You can now start using the application to shorten URLs, track clicks, and generate QR codes. Feel free to explore and customize the project according to your requirements. If you have any questions or issues, refer to the project's documentation or seek assistance from the Spit-sh community. Happy URL shortening!

## Building in Public

I'm using [Buildshare](https://www.buildshare.io/ "Buildshare") to build in public
