function ErrorsList(props) {
  const errors = props.errors;

  if (errors.length == 0) {
    return <div></div>
  }

  return (
    <div>
      <h2>Errors detected in URL:</h2>
      <ul>
        {errors.map( function(error) {
          return <li>{error}</li>
        })}
      </ul>
    </div>
  )
}

function LinksList(props) {
  const hrefs = props.hrefs;

  if (hrefs.length == 0) {
    return (
      <div>
        <h2>No links found in the URL.</h2>
      </div>
    )
  }

  return (
    <div>
      <h2>Links found in the URL:</h2>
      <ul>
        {hrefs.map( function(href) {
          return <li><a href={href}>{href}</a></li>;
        })}
        {(hrefs.length > 0) ? null : "(none)"}
      </ul>
    </div>
  )
}

function getHTML(url) {
    // TODO: try URL directly, then retry with proxy
    return fetch('/proxy?url=' + url)
      .then(response => {
        return response.text();
      }).then((html) => {
        return html;
      }).catch((error) => {
        console.error(error)
      });
  }

function getLinksFromHTML(html, base) {
  var hrefs = [];
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');
  var anchors = doc.getElementsByTagName('a');
  for (var i=0; i < anchors.length; i++) {
    var href = anchors[i].getAttribute('href');
    if (href) {
      href = href.trim();
      if (href.startsWith('#')) {
          console.log("Skipped anchor: " + href);
      } else if (href.startsWith('/')) {
        hrefs.push(base + href);
      } else {
        hrefs.push(href);
      }
    }
  }
  return hrefs;
}

function getErrors(url) {
  return fetch('/validate', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: [url],
      }),
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.length > 0) {
        return data[0].errors;
      } else {
        return [];
      }
    }).catch(error => {
      console.error(error)
    });
}

class LinkForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      url: 'https://en.2wikipedia.org/wiki/React_(JavaScript_library)',
      errors: [],
      hrefs: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({url: event.target.value});
  }

  handleSubmit(event) {
    getErrors(this.state.url
      ).then((errors) => {
        this.setState({errors: errors});
      });
    getHTML(this.state.url
      ).then((html) => {
        return getLinksFromHTML(html, this.state.url);
      }).then((hrefs) => {
        this.setState({hrefs: hrefs});
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>

        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.url} onChange={this.handleChange} />
          <input type="submit" class="button-submit" value="Submit" />
        </form>

        <ErrorsList errors={this.state.errors} />

        <LinksList hrefs={this.state.hrefs} />

      </div>
    );
  }
}

ReactDOM.render(<LinkForm />, document.getElementById('main'));
