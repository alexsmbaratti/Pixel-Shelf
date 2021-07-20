import requests

api_url = 'http://pixel-shelf.local:3000'

# Cache
cached_library_count = None
cached_wishlist_count = None

def getLibraryCount():
    global cached_library_count
    print('Fetching library count from server...')
    try:
        r = requests.get(url = api_url + '/api/library/size')
        data = r.json()
        count = data['size']
        cached_library_count = count
        print('Fetched ' + str(count) + ' games from server')
    except requests.exceptions.ConnectionError:
        print('Could not fetch size from server!')
        if cached_library_count:
            print('Falling back to cached count of ' + str(cached_library_count))
            return False, cached_library_count
        else:
            return False, '?'
    return True, count

def getWishlistCount():
    global cached_wishlist_count
    print('Fetching wishlist count from server...')
    try:
        r = requests.get(url = api_url + '/api/wishlist/size')
        data = r.json()
        count = data['size']
        cached_wishlist_count = count
        print('Fetched ' + str(count) + ' wishlist games from server')
    except requests.exceptions.ConnectionError:
        print('Could not fetch size from server!')
        if cached_wishlist_count:
            print('Falling back to cached count of ' + str(cached_wishlist_count))
            return False, cached_wishlist_count
        else:
            return False, '?'
    return True, count