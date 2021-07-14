import requests

api_url = 'http://pixel-shelf.local:3000'

# Cache
cached_count = None

def getLibraryCount():
    print('Fetching library count from server...')
    try:
        r = requests.get(url = api_url + '/api/library/size')
        data = r.json()
        count = data['size']
        cached_count = count
        print('Fetched ' + str(count) + ' games from server')
    except requests.exceptions.ConnectionError:
        print('Could not fetch size from server!')
        if cached_count:
            print('Falling back to cached count of ' + str(cached_count))
            return False, cached_count
        else:
            return False, '?'
    return True, count