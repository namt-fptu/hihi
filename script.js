// Tập hợp love được chạm
const loveTaps = new Set();
let userName = 'Mei';

function startApp() {
  const stageIds = ['cardStage', 'startStage', 'inputStage', 'loveStage'];
  const stages = Object.fromEntries(stageIds.map(id => [id, document.getElementById(id)]));

  if (Object.values(stages).some(stage => !stage)) {
    console.error('Thiếu một trong các element stage!');
    return;
  }

  // Ẩn startStage và chuyển đến loveStage
  stages.startStage.style.display = 'none';
  stages.inputStage.style.display = 'none';
  stages.loveStage.style.display = 'block';
  stages.cardStage.style.display = 'none';

  // KHÔNG phát nhạc ở đây nữa - chỉ phát sau khi chạm đủ 4 love
  
  // Reset love taps khi bắt đầu lại
  loveTaps.clear();
  document.querySelectorAll('.love-icon').forEach(icon =>
    icon.classList.remove('tapped')
  );
  
  // Reset photo frames and card header
  document.querySelectorAll('.photo-frame').forEach(frame =>
    frame.classList.remove('show')
  );
  
  const cardHeader = document.getElementById('cardHeader');
  if (cardHeader) {
    cardHeader.style.display = 'none';
  }
}

// Hiệu ứng gõ chữ - Tăng tốc độ
typeWriterEffect = (text, elementId, callback) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy element với ID: ${elementId}`);
    return;
  }

  let i = 0;
  const speed = 25; // Giảm từ 50 xuống 25 để tăng tốc độ
  element.textContent = '';

  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      console.log('Hiệu ứng gõ hoàn tất');
      callback?.();
    }
  };

  type();
};

function switchStage(fromId, toId, withFade = false) {
  const fromElement = document.getElementById(fromId);
  const toElement = document.getElementById(toId);

  if (!fromElement || !toElement) {
    console.error(`Không tìm thấy element: ${fromId} hoặc ${toId}`);
    return;
  }

  if (withFade) {
    fromElement.classList.add('hidden');
    setTimeout(() => {
      fromElement.style.display = 'none';
      toElement.style.display = 'block';
    }, 1000);
  } else {
    fromElement.style.display = 'none';
    toElement.style.display = 'block';
  }
}

// Hàm phát nhạc nền
function playBackgroundMusic() {
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    bgMusic.play().catch(err => {
      console.warn('Không thể phát nhạc:', err);
      // Thử phát lại sau một khoảng thời gian ngắn
      setTimeout(() => {
        bgMusic.play().catch(e => console.warn('Vẫn không thể phát nhạc:', e));
      }, 1000);
    });
  }
}

function tapLove(id) {
  if (loveTaps.has(id)) return;

  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
  loveIcon.classList.add('tapped');
  loveTaps.add(id);
  console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);

  if (loveTaps.size === 5) { // Thay đổi từ 4 thành 5
    Swal.fire({
      title: '🌟 Đủ 5 love rồi nè! 🌟', // Thay đổi text
      text: 'Nam có lời nhắn đặc biệt dành cho Mei! 💖',
      timer: 2000,
      showConfirmButton: false,
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      color: '#d63384',
      customClass: { 
        title: 'swal-title', 
        content: 'swal-text',
        popup: 'swal-cute-popup'
      },
      iconHtml: '💌',
      showClass: {
        popup: 'animate__animated animate__bounceIn'
      },
      hideClass: {
        popup: 'animate__animated animate__bounceOut'
      }
    }).then(() => {
      // BẮT ĐẦU PHÁT NHẠC KHI VÀO GIAI ĐOẠN QUÀ
      playBackgroundMusic();
      
      switchStage('loveStage', 'cardStage', true);

      // Show card header after stage transition
      setTimeout(() => {
        const cardHeader = document.getElementById('cardHeader');
        if (cardHeader) {
          cardHeader.style.display = 'block';
          cardHeader.style.opacity = '0';
          cardHeader.style.transition = 'opacity 1s ease';
          setTimeout(() => {
            cardHeader.style.opacity = '1';
          }, 100);
        }
      }, 300);

      // Show photo frames with faster animation
      setTimeout(() => {
        const photoFrames = document.querySelectorAll('.photo-frame');
        photoFrames.forEach((frame, index) => {
          setTimeout(() => {
            frame.classList.add('show');
          }, index * 150); // Giảm từ 200ms xuống 150ms
        });
      }, 600);

      const loveMsg = document.getElementById('loveMsg');
      if (!loveMsg) return console.error('Không tìm thấy element loveMsg!');

      // Start typing message after a shorter delay
      setTimeout(() => {
        typeWriterEffect(
          `${userName} ơiii, Nam biết dạo này Mei đang chịu nhiều áp lực và mệt mỏi lắm á. Nam chỉ muốn Mei nhớ rằng Mei không bao giờ phải đối mặt một mình cả.

Nam tin Mei là cô gái siu mạnh mẽ và siu thông minh luônn , Mei sẽ vượt qua được tất cả. Dù mọi thứ có khó khăn đến đâu, Nam vẫn luôn ở đây, ủng hộ và yêu thương Mei.

Khi mệt thì Mei cứ nghỉ ngơi, khi buồn thì Mei cứ khóc, vì sau cơn mưa rồi cũng sẽ có cầu vồng. Với Nam, Mei luôn đáng yêu vcl luôn và Mei xứng đáng nhận những điều tốt đẹp nhất. 🌈💖

Nam yêu Mei nhiều lắm! hihi OwO 💝`,
          'loveMsg',
          () => {
            const fromTag = document.createElement("div");
            fromTag.id = 'fromTag';
            fromTag.textContent = "From: Nam Péo With Love ❤️";
            fromTag.style.marginTop = "20px";
            fromTag.style.opacity = "0";
            fromTag.style.transition = "opacity 1s ease";
            loveMsg.appendChild(fromTag);

            setTimeout(() => {
              fromTag.style.opacity = "1";
            }, 500);
          }
        );
      }, 800); // Delay shorter for faster experience
    });
  }
}
