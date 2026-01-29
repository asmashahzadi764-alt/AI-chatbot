from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from PIL import Image
import base64
import io
import os

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.2-11b-vision-preview",
    temperature=0.4
)

async def get_image_response(question: str, image):
    img = Image.open(image.file)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")

    img_base64 = base64.b64encode(buffer.getvalue()).decode()

    message = HumanMessage(
        content=[
            {"type": "text", "text": question},
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/png;base64,{img_base64}"
                },
            },
        ]
    )

    result = llm.invoke([message])

    return {"answer": result.content}
