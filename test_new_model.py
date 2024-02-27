from transformers import BertTokenizer, BertForSequenceClassification, AdamW,AutoModelForSequenceClassification
import torch
from torch.utils.data import DataLoader, TensorDataset
# Load BERT tokenizer and model
tokenizer = BertTokenizer.from_pretrained('HooshvareLab/bert-fa-zwnj-base')
model = AutoModelForSequenceClassification.from_pretrained('C:\\Users\\EMERTAT\\Downloads\\new_model_class')


input_text =" پیتزا اضافه کن"
input_encoding = tokenizer(input_text, truncation=True, padding=True, max_length=128, return_tensors='pt')

# Make predictions
with torch.no_grad():
    outputs = model(input_encoding['input_ids'], attention_mask=input_encoding['attention_mask'])
    print(outputs.logits)
    predicted_class = torch.argmax(outputs.logits, dim=1).item()

# Map predicted class to label
categories =['Delete', 'Edit', 'OTher', 'Order'] # Update with your actual class labels
predicted_label = categories[predicted_class]

print(f"Predicted class: {predicted_label}")