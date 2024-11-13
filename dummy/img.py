import requests

def get_musicbrainz_id(isrc):
    """ISRC'den MusicBrainz ID'sini al."""
    url = f"https://musicbrainz.org/ws/2/recording?query=isrc:{isrc}&fmt=json"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        return data["recordings"][0]["releases"][0]["id"]

def get_album_cover(musicbrainz_id):
    """MusicBrainz ID'si ile Cover Art Archive'den albüm kapağını al."""
    url = f"https://coverartarchive.org/release/{musicbrainz_id}/"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'images' in data and data['images']:
            for image in data['images']:
                if image['image']:
                    return image['image']
    return None

def download_image(url, filename):
    """Verilen URL'deki resmi indir ve dosya olarak kaydet."""
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as file:
            file.write(response.content)
        print(f"Resim indirildi: {filename}")
    else:
        print("Resim indirilemedi.")

# ISRC kodunu gir
isrc_code = "USSM12309176"  # Örnek ISRC kodu

# ISRC üzerinden MusicBrainz ID'sini al
musicbrainz_id = get_musicbrainz_id(isrc_code)

if musicbrainz_id:
    print(f"MusicBrainz ID: {musicbrainz_id}")

    # Albüm kapağını al
    album_cover_url = get_album_cover(musicbrainz_id)

    if album_cover_url:
        print(f"Albüm kapağı URL'si: {album_cover_url}")

        # Albüm kapağını indir
        download_image(album_cover_url, "album_cover_1200x1200.jpg")
    else:
        print("Albüm kapağı bulunamadı.")
else:
    print("MusicBrainz ID bulunamadı.")
