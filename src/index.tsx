import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

console.time('initLoad');
import pages from './pages/index';

const Page = pages[0].page;

ReactDOM.render(
  <Page/>,
  $('div[data-type="main"]')[0]
)

console.timeEnd('initLoad');