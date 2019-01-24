import React from 'react';
import {
  Article,
  Text,
  Paragraph,
  TextLink,
  Break,
  Image,
  Title,
  Heading,
  Subheading,
  H4,
  H5,
  H6,
} from '../basics/Text';

// remark includes an "AST" of HTML, and I want to be able to use styled-
// components with it. Thus, HTML tree renderer. Maps tagNames to a
// styled-component, plus some quirks due to HTML validation.
export const renderHtml = (ast, frontmatter) => {
  return (
    <Article>
      <Title>{frontmatter.title}</Title>
      {renderTree(ast.children)}
    </Article>
  );
};

// This is an abomination, but this is statically rendered (thus will never
// reorder) and it takes care of the key warning. Don't @ me.
let key = 0;

const renderTree = nodes =>
  nodes.map(({ type, tagName, properties, children, value }) => {
    if (type === 'text') {
      return value.replace('\n', ' ');
    }
    if (type === 'element') {
      const { tagName: Component, props, noChildren } = mapTagToComponent(
        tagName,
        properties,
      );
      // img and hrs can't be rendered with children or React bitches.
      return noChildren ? (
        <Component key={key++} {...props} />
      ) : (
        <Component key={key++} {...props}>
          {renderTree(children)}
        </Component>
      );
    }
    return 'UNKNOWN NODE';
  });

export const mapTagToComponent = (tagName, props) => {
  switch (tagName) {
    case 'root':
      return { tagName: 'article', props };
    case 'a': {
      return {
        tagName: TextLink,
        props,
      };
    }
    case 'p':
      return {
        tagName: Paragraph,
        props,
      };
    case 'h1':
      return {
        tagName: Title,
        props,
      };
    case 'h2':
      return {
        tagName: Heading,
        props,
      };
    case 'h3':
      return {
        tagName: Subheading,
        props,
      };
    case 'img':
      return {
        tagName: Image,
        props,
        noChildren: true,
      };
    case 'hr':
      return {
        tagName: Break,
        props,
        noChildren: true,
      };
    case 'span':
      return {
        tagName: Text,
        props,
      };
    case 'h4':
      return {
        tagName: H4,
        props,
      };
    case 'h5':
      return {
        tagName: H5,
        props,
      };
    case 'h6':
      return {
        tagName: H6,
        props,
      };
    default:
      return { tagName: Text, props };
  }
};