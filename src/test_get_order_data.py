import openai
import time
openai.api_key = "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"

total_sentences = 50
sentences_per_iteration = 5
sleep_time = 4  # in seconds
temperature = 0.8  # Adjust this value for desired randomness
continuation_token = None

received_data = []

# First request to get as much data as possible
response = openai.Completion.create(
    engine="text-davinci-003",
    prompt="""برای پروژه ام من به جملاتی در مورد سفارش دادن نیاز دارم مثل :
،یک پیتزا به همراه سیب زمینی،
من یک دست مبل به همراه کاناپه میخوام،
تقاضای دو عدد کره بادام زمینی دارم،
چیپس و پنیر به سفارشام اضافه کن،
لطفا نوشابه کوکالا،
همبرگر با قارچ را اضافه کن،
در سفارش های موجود کباب را نیز قرار بده،
در میان سفارش ها مرغ سوخاری را نیز بگنجان
من میخواهم که به تعداد دقیقا ۱۰۰ جمله همانند جملاتی که به عنوان نمونه داده ام را دربیاوری
همچنین دقت داشته باش که جملات بدون فعل همانند ساختار های زیر در داده ها وجود داشته باشد مثل 
لطفا یک ساندویچ مرغ
همبرگر با سالاد لطفا
اضافه کردن پیتزا و سیب زمینی """,
    max_tokens=500,  # Adjust this value as needed
    n=total_sentences,
    temperature=temperature
)

received_data.extend([choice.text.strip() for choice in response.choices])
continuation_token = response['id']

# Loop to continue fetching data using the continuation token
while len(received_data) < total_sentences:
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt="",
        max_tokens=500,  # Adjust this value as needed
        n=total_sentences - len(received_data),
        temperature=temperature,
        token=continuation_token,
        messages=[
            {"role": "system", "content": "Continue from where you left off:", "id": continuation_token}]
    )

    received_data.extend([choice.text.strip() for choice in response.choices])
    continuation_token = response['id']

    # Sleep for the specified time before the next iteration
    time.sleep(sleep_time)

# Process and use the received_data as needed
for sentence in received_data:
    print(sentence)
