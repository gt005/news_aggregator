OTP_CODE_TEMPLATE = '''<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Код подтверждения</title>
    <style>
        * {{
            font-family: 'Inter', sans-serif
        }}
        body {{
            width: 100%;
            height: 100%;
            margin: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }}
        .container {{
            box-shadow: 0 0 4px #00000040;
            width: 300px;
            border-radius: 20px;
            padding: 32px;
        }}
        .container__data__header {{
            margin-top: 24px;
        }}
        .container__data__logo {{
            display: flex;
            justify-content: center;
        }}
        .container__data__logo img {{
            height: 70px;
            width: 70px;
            border-radius: 20px;
        }}
        .container__data__code__code {{
            background: rgb(16, 28, 45);
            color: white;
            padding: 24px;
            text-align: center;
            font-size: 24px;
            margin: 32px 0;
            border-radius: 20px;
            font-weight: bold;
        }}
        .container__data__additional-info {{
            margin-top: 24px;
            font-size: 12px;
        }}
    </style>
</head>

<body>
    <div class="container">
        <div class="container__data">
            <div class="container__data__logo">
                <img src="http://news-fusion.ru/logo.png" alt="logo">
            </div>
            <h2 class="container__data__header">
                Добрый день!
            </h2>
            <p class="container__data__code">Ваш код подтверждения в сервисе News Fusion:</p>
            <div class="container__data__code__code">{code}</div>

            <p class="container__data__additional-info">Никому не сообщайте ваш код! <br>Если вы не запрашивали код, можете просто проигнорировать данное сообщение.</p>
            
        </div>
    </div>
</body>

</html>'''