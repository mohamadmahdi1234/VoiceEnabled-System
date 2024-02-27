from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi_socketio import SocketManager
from transformers import AutoModelForSequenceClassification
import uvicorn
import json
import openai
import asyncio
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from transformers import BertTokenizer, BertForSequenceClassification, AdamW,AutoTokenizer
import torch
openai.api_key = "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"

loaded_model_classification = AutoModelForSequenceClassification.from_pretrained('C:\\Users\\EMERTAT\\Desktop\\voice_test\\VoiceEnabled-System\\fine_tuned_model_classification_v1')
tokenizer = BertTokenizer.from_pretrained('HooshvareLab/bert-fa-zwnj-base')
app = FastAPI()
sio = SocketManager(app=app, async_mode='asgi')
# Create an asyncio lock
model_lock = asyncio.Lock()


import httpx

async def extract_fooditems_quantity(message):
    csharp_server_url = 'https://localhost:7227/NerFoodAndNumber?'+'s='+ message

    # Make GET request to the C# server using httpx
    async with httpx.AsyncClient(verify=False) as client:
        response = await client.get(csharp_server_url)
        print(response)
        if response.status_code == 200:
        # Parse JSON response and extract the required information
            data = response.json()
            processed_data = []

            for item in data:
                food_name = item['food']['name']
                number_text = item['number']['persiantext']
                number_value = item['number']['number']

                processed_data.append({
                'name_of_item_order': food_name,
                'number_text': number_text,
                'number_value': number_value
                })

            return processed_data, 200

        else:
        # Handle the case where the GET request fails
            return {'error': 'Failed to retrieve data from C# server'}, 500
        

    


async def identify_class(input_text):
    async with model_lock:
        input_encoding = tokenizer(input_text, truncation=True, padding=True, max_length=128, return_tensors='pt')

        # Make predictions
        with torch.no_grad():
            outputs = loaded_model_classification(input_encoding['input_ids'], attention_mask=input_encoding['attention_mask'])
            predicted_class = torch.argmax(outputs.logits, dim=1).item()

        # Map predicted class to label
        categories = ['Delete', 'Edit', 'Other', 'Order']  # Update with your actual class labels
        predicted_label = categories[predicted_class]
        return predicted_label



async def get_order_items(message):
    predicted_class =await identify_class(message)
    print("predicted class is : ")
    print(predicted_class)
    generated_text,code = await extract_fooditems_quantity(message)
    print(generated_text)
    print("//////////////////////////////////")
    return generated_text,predicted_class,code


@sio.on('connect')
async def connect(sid, environ):
    print(f'Client {sid} connected')


@sio.on('result_1')
async def handle_result_1(sid, data):
    # Handle result_1
    print(data)
    result,category,code = await get_order_items(data)
    print(result)
    if code == 200 :
        if category == "Order":
            await sio.emit('order_items', result)
        elif category == "Edit":
            await sio.emit('Edit_items', result)
        elif category == "Delete" :
            await sio.emit('delete_items', result)

        


@sio.on('result_2')
async def handle_result_2(sid, data):
    # Handle result_2
    print(f'Received result_2 from client {sid}: {data}')


@sio.on('disconnect')
async def disconnect(sid):
    print(f'Client {sid} disconnected')





if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3002)
