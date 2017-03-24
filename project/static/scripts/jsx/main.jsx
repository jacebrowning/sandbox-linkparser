function ErrorsList(props) {
  const errors = props.errors;

  if (errors.length == 0) {
    return <div></div>
  }

  return (
    <div>
      <hr></hr>
      <h2>Errors detected in the URL</h2>
      <ul className="list-group">
        {errors.map( function(error) {
          return <li className="list-group-item text-danger">{error}</li>
        })}
      </ul>
    </div>
  )
}

function LinksList(props) {
  const processing = props.processing;
  const hrefs = props.hrefs;

  if (processing) {
    return <div></div>
  }

  if (hrefs.length == 0) {
    return (
      <div>
        <hr></hr>
        <h2>Links found in the URL</h2>
        <ul className="list-group">
          <li className="list-group-item text-muted">None</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <hr></hr>
      <h2>Links found in the URL</h2>
      <ul className="list-group">
        {hrefs.map( function(href) {
          return <li className="list-group-item"><a href={href} target="_blank">{href}</a></li>;
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
      } else if (href.startsWith('//')) {
        hrefs.push('http:' + href);
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
      url: '',
      processing: true,
      errors: [],
      hrefs: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({url: event.target.value.trim()});
  }

  handleSubmit(event) {
    this.setState({hrefs: [], errors: []});
    getErrors(this.state.url
      ).then((errors) => {
        this.setState({errors: errors});
      });
    getHTML(this.state.url
      ).then((html) => {
        return getLinksFromHTML(html, this.state.url);
      }).then((hrefs) => {
        this.setState({processing: false, hrefs: hrefs});
      });
    event.preventDefault();
  }

  render() {
    return (
      <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">

        <form onSubmit={this.handleSubmit} className="input-group">
          <input type="text" placeholder="URL of an HTML page..." value={this.state.url} onChange={this.handleChange} className="form-control" />
          <span className="input-group-btn">
            <input type="submit" value="Process URL" className="btn btn-primary" />
          </span>
        </form>

        <ErrorsList errors={this.state.errors} />

        <LinksList processing={this.state.processing} hrefs={this.state.hrefs} />

      </div>
    );
  }
}

ReactDOM.render(<LinkForm />, document.getElementById('main'));
