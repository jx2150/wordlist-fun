# ReactList

A versatile infinite scroll [React] component.

## Install

```bash
bower install react-list
```

## API

### Properties

#### items

The list of items to be rendered.

#### renderItems(children)

A function that receives the rendered items as children. **You must set
ref='items' on the element that contains `children` so item calculations can be
made.** By default this element is a `<div>`.

#### renderItem(item, index)

A function that receives an item (and its relative index) and returns the
content to be rendered for that item.

#### renderLoading()

A function that should return a loading message.

#### renderError(error)

A function that receives an error from a failed `fetch` and should return an
error message.

#### renderEmpty()

A function that should return a message when no items are available to render.

#### renderPageSize (defaults to `10`)

A number that specifies how many items to render per page (this is calculated automatically for `uniform` items).

#### threshold (defaults to `500`)

The number of pixels to ensure the top and bottom of the list is buffered with.

#### uniform (defaults to `false`)

A boolean that specifies whether or not the rendered items are of uniform width
and height. Uniform items allow space to be preallocated on the page without actually rendering the items.

#### fetch

A function that receives a callback. The callback should be invoked when the
fetch is complete with the error (if any) as the first argument and a boolean
determining whether the entire list is fetched or not.

## Examples

Check out [the test file](https://orgsync.github.io/react-list/test.html) for a
full example.

[React]: https://github.com/facebook/react
