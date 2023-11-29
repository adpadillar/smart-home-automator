
import requests
import time

def send_requests(url, duration_seconds):
    start_time = time.time()

    while (time.time() - start_time) < duration_seconds:
        try:
            response = requests.get(url)
            # You can process the response if needed
            print(f"Request sent. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error sending request: {e}")

        time.sleep(1)  # Adjust this delay as needed

    print("Request sending completed.")

# Example usage
url_to_send_requests = "https://example.com"
duration_in_seconds = 60  # Change this to the desired duration
send_requests(url_to_send_requests, duration_in_seconds)
