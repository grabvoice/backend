class Chatbox {
        constructor() {
            this.args = {
                openButton: document.querySelector('.chatbox__button'),
                chatBox: document.querySelector('.chatbox__support'),
                sendButton: document.querySelector('.send__button')
            }
        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        this.prompt(chatBox)

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        openButton.click(); // add this line to click the openButton by default

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })


    }


    prompt(chatbox) {
        // const audio = new Audio("/static/images/output.wav");
        // audio.controls = true;
        this.messages.push({ 
            name: "Bot", 
            message: "Hi. My name is Matthew. How can I help you?",
            audio: "/static/images/output.wav"
        });
        // this.messages.push({ name: "Bot", message: "Hi. My name is Matthew. How can I help you?" });
        // this.messages.push({ name: "Bot", audio: true, message: audio });
        this.updateChatText(chatbox)
    }




    toggleState(chatbox) {
        this.state = !this.state;
        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Bot", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Bot")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + "&#x1F4AC";
                if (item.audio) {
                    // html += '<audio src="' + item.audio + '" controls></audio>';
                }

                html += '</div>';
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + "&#x1F4AC" + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }


}


const chatbox = new Chatbox();
chatbox.display();