from django.urls import path
from . import views

urlpatterns = [
    path('chatbot/', views.chatbot, name='chatbot'),
    path('new-chat/', views.new_chat, name='new_chat'),
    path('chat-history/', views.chat_history, name='chat_history'),
    path('reset-chats/', views.reset_chats, name='reset_chats'),  # Add this line
]
