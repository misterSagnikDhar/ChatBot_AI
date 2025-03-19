import google.generativeai as genai
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
import pymongo
import uuid
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# MongoDB connection
MONGO_CLIENT = pymongo.MongoClient(settings.MONGO_URI)
MONGO_DB = MONGO_CLIENT[settings.MONGO_DB_NAME]
CHATS_COLLECTION = MONGO_DB["chats"]


@api_view(['POST'])
def chatbot(request):
    user_input = request.data.get('message')
    conversation_id = request.data.get('conversation_id')

    if not user_input:
        return Response({'error': 'Please provide a message'}, status=400)

    try:
        response = model.generate_content(user_input)
        bot_response = response.text
        chat_data = {
            "user_input": user_input,
            "bot_response": bot_response,
            "timestamp": datetime.now(),
            "conversation_id": conversation_id,
        }
        CHATS_COLLECTION.insert_one(chat_data)
        return Response({"response": bot_response})
    except Exception as e:
        logger.error(f"Error in chatbot: {str(e)}")
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def new_chat(request):
    try:
        conversation_id = str(uuid.uuid4())
        return Response({"conversation_id": conversation_id})
    except Exception as e:
        logger.error(f"Error in new_chat: {str(e)}")
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def chat_history(request):
    conversation_id = request.GET.get('conversation_id')
    try:
        query = {"conversation_id": conversation_id} if conversation_id else {}
        chats = list(CHATS_COLLECTION.find(query, {'_id': 0}).sort('timestamp', 1))
        logger.debug(f"Chat history for {conversation_id}: {chats}")
        return Response({"chats": chats})
    except Exception as e:
        logger.error(f"Error in chat_history: {str(e)}")
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def reset_chats(request):
    try:
        logger.debug("Attempting to reset all chats...")
        # Verify collection state before reset
        initial_count = CHATS_COLLECTION.count_documents({})
        logger.debug(f"Initial chat count: {initial_count}")

        # Delete all documents
        result = CHATS_COLLECTION.delete_many({})

        # Verify collection state after reset
        remaining_count = CHATS_COLLECTION.count_documents({})
        logger.debug(f"Deleted {result.deleted_count} chats. Remaining chats: {remaining_count}")

        if remaining_count > 0:
            logger.warning("Chats remain after reset!")

        return Response({"message": f"Deleted {result.deleted_count} chats", "remaining": remaining_count})
    except Exception as e:
        logger.error(f"Error in reset_chats: {str(e)}")
        return Response({"error": str(e)}, status=500)
