'use strict';
function wrapText(context, text, marginLeft, marginTop, maxWidth, maxHeight, lineHeight) {
  let words = text.split(' ');
  let countWords = words.length;
  let line = '';
  if (+maxHeight > 200 && +maxHeight <= 300) {
    marginTop += 50;
  }
  if (+maxHeight > 300) {
    marginTop += 100;
  }
  if (words.length < 3) {
    marginTop += 25;
  }

  for (let n = 0; n < countWords; n++) {
    let testLine = line + words[n] + ' ';
    let testWidth = context.measureText(testLine).width;
    if (testWidth > maxWidth) {
      context.fillText(line, marginLeft, marginTop);
      line = words[n] + ' ';
      marginTop += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, marginLeft, marginTop);
}

{
  let canvas = document.querySelector('#canvas');
  let inputColor = document.querySelector('input[type="color"]');
  let widthField = document.querySelector('#widthField');
  let heightField = document.querySelector('#heightField');
  let form = document.querySelector('form');
  let uploadFile = document.querySelector('#upload');
  let img = document.createElement('img');
  let buttonWrapper = document.querySelector('.wrapper-button');
  let textarea = document.querySelector('textarea');
  let ctx = canvas.getContext('2d');
  let banner = {};

  uploadFile.addEventListener('change', function () {
    let file = uploadFile.files[0];
    let reader = new FileReader();
    reader.onloadend = function () {
      img.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      img.src = '';
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if ((+widthField.value) <= 200 && (+heightField.value) <= 400) {
      banner.width = canvas.width = widthField.value;
      banner.height = canvas.height = heightField.value;
      ctx.fillStyle = banner.color = inputColor.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width / 2 - img.width / 2), 20);
      banner.src = img.src;
      banner.textarea = textarea.value;
      ctx.font = '20px Arial';
      ctx.fillStyle = '#ffffff';
      wrapText(ctx, textarea.value, 7, canvas.height / 2 + 45, canvas.width, canvas.height, 20);
      ctx.textAlign = 'left';
    } else {
      alert('Слишком большая ширина или высота. Максимальное значение 200x400 пикселей');
    }
  });

  buttonWrapper.addEventListener('click', function (event) {
    let target = event.target;
    let data = canvas.toDataURL('image/png');

    if (target.classList.contains('save')) {
      target.setAttribute('download', 'Ваш_Банер.png');
      target.href = data;
    }

    if (target.classList.contains('copy-html')) {
      let elementHtml = document.createElement('a');
      let imgElem = document.createElement('img');
      imgElem.src = data;
      elementHtml.href = '#';
      elementHtml.append(imgElem);
      navigator.clipboard.writeText(elementHtml.outerHTML).then(function () {
        alert('HTML строка скопированна в буфер обмена');
      }, function () {

      });
    }

    if (target.classList.contains('copy-json')) {
      if ('width' in banner) {
        let json = JSON.stringify(banner, null, 2);
        navigator.clipboard.writeText(json).then(function () {
          alert('JSON строка скопированна в буфер обмена');
        }, function () {

        });
      } else {
        alert('Данных еще нет');
      }
    }
  });
}
