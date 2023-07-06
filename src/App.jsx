/* eslint-disable no-console */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => ({
  ...product,
  category: categoriesFromServer
    .find(category => category.id === product.categoryId),
}));

const productsWithUsers = products.map(product => ({
  ...product,
  user: usersFromServer.find(user => user.id === product.category.ownerId),
}));

const getFilteredProducts = (array, query) => {
  let filteredArray = [...array];

  if (filteredArray.some(product => product.user.id === +query)) {
    filteredArray = filteredArray.filter(product => product.user.id === +query);
  }

  if (filteredArray
    .some(product => product.name.toLowerCase()
      .includes(query.toLowerCase().trim()))) {
    filteredArray = filteredArray
      .filter(product => product.name.toLowerCase()
        .includes(query.toLowerCase().trim()));
  }

  return filteredArray;
};

export const App = () => {
  const [query, setQuery] = useState('');

  const visibleUsers = getFilteredProducts(productsWithUsers, query);

  const findUser = id => productsWithUsers
    .find(user => user.user.id === id).user.name;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setQuery('all')}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              <a
                onClick={() => setQuery('1')}
                data-cy="FilterUser"
                href="#/"
              >
                {findUser(1)}
              </a>

              <a
                onClick={() => setQuery('2')}
                data-cy="FilterUser"
                href="#/"
              >
                {findUser(2)}
              </a>

              <a
                onClick={() => setQuery('3')}
                data-cy="FilterUser"
                href="#/"
              >
                {findUser(3)}
              </a>
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={event => setQuery(event.target.value)}
                  value={query}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    onClick={() => {
                      setQuery('');
                    }}
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={classNames(
                      { 'has-text-danger': product.user.sex === 'f',
                        'has-text-link': product.user.sex === 'm' },
                    )}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
