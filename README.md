# University Timetable Management System API

Welcome to the University Timetable Management System API! This RESTful API facilitates the creation, modification, and querying of class schedules for students, faculty, and administrative staff. With an emphasis on secure access and data integrity, this project simulates real-world software development challenges and solutions within an educational institution context.

## Setup Instructions

1. **Get Started:**

    ```bash
    git clone https://github.com/sliitcsse/assignment-01-IsuruX98.git
    cd assignment-01-IsuruX98/backend
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Launch the Server:**

    ```bash
    npm start
    ```

## Folder Structure
    
![Screenshot 2024-03-23 185911](https://github.com/sliitcsse/assignment-01-IsuruX98/assets/104721314/4a34a82f-effc-482c-945c-95fa9740a7cb)


## API Documentation

Discover and interact with the API endpoints using the user-friendly Postman UI. [Click here](https://documenter.getpostman.com/view/24967536/2sA35A95ZP#ca43a3bd-7147-451b-a1a2-b0fb3b6ef3a2) to access detailed documentation that thoroughly describes each endpoint, including request parameters, responses, and examples. You can effortlessly test each endpoint directly within Postman, ensuring a seamless experience while exploring the capabilities of the API.

sample screenshot ->

![Screenshot (47)](https://github.com/sliitcsse/assignment-01-IsuruX98/assets/104721314/43ed2b1d-1df4-4eee-b2bc-d65f4c872866)

## Testing

Run comprehensive tests with Jest. Install Jest using:

```bash
npm install --save-dev jest
```

Testing files are located in the `tests/` directory. To run specific tests, use:

```bash
npx jest <filename.ext>
```

sample test run screenshot ->

![Screenshot 2024-03-23 190523](https://github.com/sliitcsse/assignment-01-IsuruX98/assets/104721314/190d317e-c1d2-4531-abe1-4104b310b811)


### Performance Testing

Evaluate performance using scripts in `tests/performanceTesting`. Ensure Artillery.io is installed globally:

```bash
npm install -g artillery
```

Before running performance tests, ensure PowerShell is opened as an administrator and set the execution policy:

```bash
Set-ExecutionPolicy RemoteSigned
```

Then execute performance tests with:

```bash
artillery run <filename.ext>
```

### Security Testing

Ensure backend security with OWASP ZAP. Run the Spider and Active Scan, and review the HTML report located in `tests/securityTesting`.

![Screenshot (48)](https://github.com/sliitcsse/assignment-01-IsuruX98/assets/104721314/fda250fc-3eff-4fd8-90e3-3ec47bf47484)


## Additional Notes

- MongoDB must be operational before launching the server.
