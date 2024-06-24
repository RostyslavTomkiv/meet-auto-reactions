function meetAutoReactions() {
  function getElement(xpath) {
    // отримуємо доступ до елемента на сторінці через xpath
    return document.evaluate( //evaluate це метод document формат такий: (xpathExpression, contextNode, namespaceResolver, resultType, result)
      xpath, // XPath для пошуку елемента
      document,// весь документ
      null,// немає namespaceResolver
      XPathResult.FIRST_ORDERED_NODE_TYPE, // Повертаємо перший знайдений node
      null,// Немає попередніх результатів
    ).singleNodeValue; // Повертаємо перший знайдений елемент
  }
  function getEmojiButton(index) {
    const emojis = ['💖', '👍', '🎉', '👏', '😂', '😮', '😢', '🤔', '👎']; // Масив емодзі, які доступні для реакцій
    return getElement(`//button/img[@data-emoji="${emojis[index]}"]`); /*
    повертаємо елемент емодзі за допомогою XPath, використовуючи атрибут data-emoji. Індекс використовується для вибору конкретного емодзі з масиву emojis.
    */
  }

  const sendReactionButton = getElement('//i[text()="mood"]'); //Зберігає кнопку для відкриття панелі емодзі, використовуючи getElement і XPath для пошуку кнопки з текстом "mood".
  
  const intervalIds = [];//  Зберігає іd інтервалів, які використовуються для автоматичних кліків

  return ({
    startReacting(index, timeout = 1000) { //Починає кліки на кнопку емодзі через кожну задану timeout. Якщо кнопка емодзі не знайдена, спочатку натискає кнопку для відкриття панелі емодзі.
      if (!getEmojiButton(index)) sendReactionButton.click();  // Якщо кнопка емодзі не знайдена, натискаємо кнопку для відкриття панелі емодзі
      intervalIds.push(setInterval(() => {// Додаємо інтервал, який буде клікати на кнопку емодзі кожну задану кількість мілісекунд (timeout)
        try {
          getEmojiButton(index).click();   // Клікаємо на кнопку емодзі
        } catch {
          this.stopReacting();//У випадку помилки зупиняємо всі реакції
        }
      }, timeout));
    },
    stopReacting() {// Зупиняє кліки.
      intervalIds.forEach(id => clearInterval(id)); // Чистимо масив інтервалів
      intervalIds.length = 0;  
    }
  });
}

const meet = meetAutoReactions(); //створює обєкт meet 

meet.startReacting(0);//Починаємо автоматичні реакції з індексом 0
