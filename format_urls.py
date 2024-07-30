# Read URLs from urls.txt and put each URL in quotes

def read_urls(file_path):
    with open(file_path, 'r') as file:
        urls = file.readlines()
    return urls

def format_urls(urls):
    formatted_urls = [f'"{url.strip()}"' for url in urls]
    return formatted_urls

def write_formatted_urls(file_path, formatted_urls):
    with open(file_path, 'w') as file:
        for url in formatted_urls:
            file.write(f'{url}\n')

def write_js_file(file_path, formatted_urls):
    with open(file_path, 'w') as file:
        file.write('const urls = [\n')
        for url in formatted_urls:
            file.write(f'  {url},\n')
        file.write('];\n')
        file.write('export default urls;')  # If you're using ES6 modules

# Specify the input and output file paths
input_file_path = 'urls.txt'
output_file_path = 'formatted_urls.txt'
js_output_file_path = 'urls.js'

# Read, format, and write the URLs
urls = read_urls(input_file_path)
formatted_urls = format_urls(urls)
write_formatted_urls(output_file_path, formatted_urls)
write_js_file(js_output_file_path, formatted_urls)

print("URLs have been formatted and saved to", output_file_path)
print("JavaScript file has been created at", js_output_file_path)