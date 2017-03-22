function LinksList(props) {
  return (
    <ul>
      {props.hrefs.map( function(href) {
        return <li><a href={href}>{href}</a></li>;
      })}
    </ul>
  )
}


function getHTML(url) {
    // TODO: retry with proxy
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
  var doc = parser.parseFromString(html, 'text/xml');
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


class LinkForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      url: 'https://en.wikipedia.org/wiki/React_(JavaScript_library)',
      hrefs: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({url: event.target.value});
  }

  handleSubmit(event) {
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

        <LinksList hrefs={this.state.hrefs} />

      </div>
    );
  }
}


ReactDOM.render(<LinkForm />, document.getElementById('main'));
