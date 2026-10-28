with open('web/js/mozok-database.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos31 = text.find("id: 31")
if pos31 != -1:
    print(text[pos31+500:pos31+2500].encode('ascii', 'backslashreplace').decode('ascii'))
