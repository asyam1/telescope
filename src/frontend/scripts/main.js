function showModal(props = { title: 'Modal', content: 'Content' }) {
  $('.modal-panel h1').html(props.title);
  $('.modal-panel section').html('');

  props.content.forEach(element => {
    $('.modal-panel section').append(`<span><a href="${element.url}">${element.name}</a></span>`);
  });

  $('.modal-container').addClass('modal-open');

  $('.modal-container').click(function(e) {
    // if any element not inside the modal content panel is clicked, close the modal
    if (e.target === this) {
      $('.modal-container').removeClass('modal-open');
    }
  });
}

async function getPostsPage(perPage = 10) {
  $('.content').html('loading...');

  let response;
  let ids;
  let posts;

  try {
    response = await fetch(`/posts/?per_page=${encodeURIComponent(perPage)}`);
    ids = await response.json();
    posts = await Promise.all(
      ids.map(async id => {
        const res = await fetch(id.url);
        const post = await res.json();
        return post;
      })
    );
  } catch (err) {
    console.error(err);
    $('.content').html('Error loading Posts');
  }

  $('.content').html('');
  posts.forEach(post => {
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const updatedDate = new Date(post.updated).toLocaleDateString('en-CA', dateOptions);
    $('.content').append(`
            <article>
                <header>
                    <h1><a title="${post.title}" href="${post.url}">${post.title}</a></h1>
                    <div class="article-details">
                        <div class="post-author"><a href="${post.site}">${post.author}</a></div>
                        <div class="post-date">${updatedDate}</div>
                    </div>
                </header>

                <section class="post-content">
                    ${post.content}
                </section>
            </article>
            `);
  });
}

// Entry point: document loaded
$(() => {
  getPostsPage();
});

// Toggle the mobile menu
$('#mobile-burger').click(() => {
  const nav = $('nav');

  nav.addClass('mobile-menu-open');

  const close = $('#mobile-burger-close');

  close.click(function() {
    nav.removeClass('mobile-menu-open');
  });
});

// Toggle the participants modal
$('.modal-button').click(() => {
  $.get('/dummy_data/participants.json')
    .done(data => {
      showModal({ title: 'Participants', content: data.participants });
    })
    .fail(error => {
      console.error(error);
    });
});
