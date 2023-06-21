# Spit-sh

Spit-sh is an open-source URL shortener project that provides the ability to shorten URLs, track clicks, and generate QR codes for the links. It consists of a FastAPI backend written in TypeScript and a Next.js frontend.

## Getting Started

To set up and run the Spit-sh project locally, follow these steps:

### Backend

1. Clone the Spit-sh repository:

   ```bash
   git clone https://github.com/your-username/spit-sh.git
   ```

2. Set up the backend:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the dependencies using Yarn:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:

   ```bash
   yarn dev
   ```

   This will start the backend server using `ts-node-dev` and automatically reload on file changes.

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
