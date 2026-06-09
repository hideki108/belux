/**
 * main.js — 有限会社ベルックス ホームページ JavaScript
 *
 * 機能：
 * 1. ヒーロー背景画像のセット
 * 2. スクロール時のヘッダースタイル変更
 * 3. ハンバーガーメニュー（スマホ用ドロワー）
 * 4. スムーススクロール（アンカーリンク）
 * 5. スクロールアニメーション（IntersectionObserver）
 * 6. 施工実績ライトボックス
 * 7. お問い合わせフォームのバリデーションと送信処理
 */

'use strict';

/* ============================================================
   1. ヒーロー背景
   現在はCSSグラデーション（ロゴマーク表示）のため処理なし
   背景写真に戻す場合は以下のコメントを外して使用：
   document.querySelector('.hero').style.backgroundImage =
     "url('施工実績写真/背景/1780905892443.jpg')";
============================================================ */


/* ============================================================
   2. スクロール時のヘッダースタイル変更
   一定以上スクロールしたら .scrolled クラスを付与
============================================================ */
(function initHeaderScroll() {
  var header = document.getElementById('header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // 初期チェック
})();


/* ============================================================
   3. ハンバーガーメニュー（スマホ用ドロワーナビ）
============================================================ */
(function initHamburger() {
  var hamburger = document.getElementById('hamburger');
  var nav       = document.getElementById('mainNav');
  if (!hamburger || !nav) return;

  // メニューを開閉する
  function toggleMenu(open) {
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (open) {
      nav.classList.add('nav-open');
    } else {
      nav.classList.remove('nav-open');
    }
  }

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isOpen);
  });

  // ナビのリンクをクリックしたら閉じる
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  // 画面外（オーバーレイ部分）をクリックしたら閉じる
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('nav-open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Escキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });
})();


/* ============================================================
   4. スムーススクロール（アンカーリンク対応）
   CSS scroll-behavior: smooth のフォールバックも兼ねる
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '70', 10
      );
      var targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   5. スクロールアニメーション
   .animate-in 要素がビューポートに入ったら .is-visible を付与
============================================================ */
(function initScrollAnimation() {
  // IntersectionObserver非対応ブラウザはそのまま表示
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.animate-in').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 一度表示したら監視解除
      }
    });
  }, {
    threshold: 0.12,    // 12%見えたら発火
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ============================================================
   6. 施工実績ライトボックス
   各 .work-card の data-work 属性に対応した写真一覧を表示

   写真を追加・変更する場合は下記の workData を編集してください：
     src  : 画像パス（index.html からの相対パス）
     alt  : 代替テキスト（アクセシビリティ）
============================================================ */
(function initLightbox() {

  // 施工実績写真データ
  // ▼ 写真を追加・変更する場合はここを編集してください
  var workData = {
    'fushimi-roof': {
      title: '京都市伏見区 ビル屋上防水改修工事',
      images: [
        { src: '施工実績写真/伏見区屋上ビル/FO2.jpg',  alt: '伏見区屋上ビル防水工事 施工例3' },
        { src: '施工実績写真/伏見区屋上ビル/FO1.jpg',  alt: '伏見区屋上ビル防水工事 施工例2' },
        { src: '施工実績写真/伏見区屋上ビル/FO０.jpg', alt: '伏見区屋上ビル防水工事 施工例1' }
      ]
    },
    'fushimi-bath': {
      title: '京都市伏見区 お風呂リフォーム工事',
      images: [
        { src: '施工実績写真/伏見区風呂リフォーム/FF1.jpg', alt: 'お風呂リフォーム 施工例2' },
        { src: '施工実績写真/伏見区風呂リフォーム/FF0.jpg', alt: 'お風呂リフォーム 施工例1' }
      ]
    },
    'school-toilet': {
      title: '滋賀県大津市 某高校 トイレ改修工事',
      images: [
        { src: '施工実績写真/某高校トイレ/1780905878141.jpg', alt: 'トイレ改修工事 施工例2' },
        { src: '施工実績写真/某高校トイレ/T0.jpg',           alt: 'トイレ改修工事 施工例1' }
      ]
    },
    'yamashina-kitchen': {
      title: '京都市山科区 キッチンリフォーム工事',
      images: [
        { src: '施工実績写真/山科キッチンリフォーム/YK02.jpg', alt: 'キッチンリフォーム 施工例2' },
        { src: '施工実績写真/山科キッチンリフォーム/YK01.jpg', alt: 'キッチンリフォーム 施工例1' }
      ]
    }
  };

  // DOM要素
  var lightbox       = document.getElementById('lightbox');
  var overlay        = document.getElementById('lightboxOverlay');
  var closeBtn       = document.getElementById('lightboxClose');
  var titleEl        = document.getElementById('lightboxTitle');
  var imgEl          = document.getElementById('lightboxImg');
  var prevBtn        = document.getElementById('lightboxPrev');
  var nextBtn        = document.getElementById('lightboxNext');
  var counterEl      = document.getElementById('lightboxCounter');
  var thumbsEl       = document.getElementById('lightboxThumbs');

  if (!lightbox) return;

  var currentImages  = [];
  var currentIndex   = 0;

  // 指定インデックスの写真を表示
  function showImage(index) {
    currentIndex = Math.max(0, Math.min(index, currentImages.length - 1));
    var item = currentImages[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    counterEl.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentImages.length - 1;

    // サムネイルのアクティブ状態を更新
    thumbsEl.querySelectorAll('.lightbox-thumb').forEach(function (th, i) {
      th.classList.toggle('active', i === currentIndex);
    });
  }

  // ライトボックスを開く
  function openLightbox(workId) {
    var data = workData[workId];
    if (!data) return;
    currentImages = data.images;
    titleEl.textContent = data.title;

    // サムネイルを生成
    thumbsEl.innerHTML = '';
    currentImages.forEach(function (item, i) {
      var th = document.createElement('img');
      th.src       = item.src;
      th.alt       = item.alt;
      th.className = 'lightbox-thumb';
      th.loading   = 'lazy';
      th.addEventListener('click', function () { showImage(i); });
      thumbsEl.appendChild(th);
    });

    showImage(0);
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  // ライトボックスを閉じる
  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    imgEl.src = '';
  }

  // 施工実績カードのクリック/キー操作
  document.querySelectorAll('.work-card[data-work]').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(this.dataset.work);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(this.dataset.work);
      }
    });
  });

  // ナビボタン
  prevBtn.addEventListener('click', function () { showImage(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { showImage(currentIndex + 1); });

  // 閉じるボタン・オーバーレイ
  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);

  // キーボード操作
  document.addEventListener('keydown', function (e) {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'ArrowLeft')  showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'Escape')     closeLightbox();
  });

})();


/* ============================================================
   7. お問い合わせフォーム バリデーション・送信処理
   送信先はFormspree（index.html の <form action="..."> で設定）
============================================================ */
(function initContactForm() {
  var form       = document.getElementById('contactForm');
  var submitBtn  = document.getElementById('submitBtn');
  var successMsg = document.getElementById('formSuccess');
  if (!form) return;

  // エラーメッセージを設定するヘルパー
  function setError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (!input || !error) return;
    if (message) {
      error.textContent = message;
      input.classList.add('is-error');
    } else {
      error.textContent = '';
      input.classList.remove('is-error');
    }
  }

  // フォーム全体のバリデーション
  function validateForm() {
    var isValid = true;

    var name    = document.getElementById('name');
    var tel     = document.getElementById('tel');
    var email   = document.getElementById('email');
    var message = document.getElementById('message');

    // お名前（必須）
    if (!name.value.trim()) {
      setError('name', 'nameError', 'お名前を入力してください');
      isValid = false;
    } else {
      setError('name', 'nameError', '');
    }

    // 電話番号（必須・数字ハイフンのみ許容）
    if (!tel.value.trim()) {
      setError('tel', 'telError', '電話番号を入力してください');
      isValid = false;
    } else if (!/^[\d\-\(\)\+\s]+$/.test(tel.value.trim())) {
      setError('tel', 'telError', '正しい電話番号を入力してください');
      isValid = false;
    } else {
      setError('tel', 'telError', '');
    }

    // メールアドレス（任意・入力があれば形式チェック）
    if (email && email.value.trim()) {
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value.trim())) {
        setError('email', 'emailError', '正しいメールアドレスを入力してください');
        isValid = false;
      } else {
        setError('email', 'emailError', '');
      }
    } else if (email) {
      setError('email', 'emailError', '');
    }

    // ご相談内容（必須）
    if (!message.value.trim()) {
      setError('message', 'messageError', 'ご相談内容を入力してください');
      isValid = false;
    } else {
      setError('message', 'messageError', '');
    }

    return isValid;
  }

  // フォーム送信処理
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    // Formspree IDが未設定の場合は警告
    var action = form.getAttribute('action') || '';
    if (action.indexOf('ここにFormspreeのIDを入れる') !== -1) {
      alert(
        '【設定が必要です】\n' +
        'フォームの送信先（Formspree ID）が設定されていません。\n' +
        'index.html の <form action="..."> を設定してください。'
      );
      return;
    }

    // 送信中の表示
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    // FormspreeへFetchで送信
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (response) {
      if (response.ok) {
        // 送信成功
        form.reset();
        if (successMsg) {
          successMsg.removeAttribute('hidden');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        submitBtn.textContent = '送信しました';
      } else {
        throw new Error('送信に失敗しました');
      }
    })
    .catch(function () {
      // 送信失敗
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
      alert('送信に失敗しました。\nお手数ですが、お電話（075-643-8087）にてご連絡ください。');
    });
  });

  // リアルタイムバリデーション（入力後にエラーを解除）
  ['name', 'tel', 'email', 'message'].forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', function () {
      validateForm();
    });
  });

})();


/* ============================================================
   8. 空き家相談 sweep線の縦位置を「詳しくはこちら」ボタン中央に合わせる
============================================================ */
(function initVacancySweepPosition() {
  var card  = document.querySelector('.vacancy-card');
  var link  = document.querySelector('.vacancy-card-link');
  if (!card || !link) return;

  function setSweepTop() {
    // offsetTop はCSSのtransformに影響されない
    // link中央のY座標 - card上端のY座標 = カード内での相対位置
    var topPx = (link.offsetTop + link.offsetHeight / 2) - card.offsetTop;
    card.style.setProperty('--vacancy-sweep-top', topPx + 'px');
  }

  setSweepTop();
  window.addEventListener('resize', setSweepTop);
})();
