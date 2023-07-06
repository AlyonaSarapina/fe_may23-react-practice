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

  if (typeof query === 'number') {
    filteredArray = filteredArray.filter(product => product.user.id === +query);
  }

  if (typeof query === 'string' && query !== 'all') {
    filteredArray = filteredArray
      .filter(product => product.name.toLowerCase()
        .includes(query.toLowerCase().trim()));
  }

  return filteredArray;
};

const productsByCategories = (array, category) => {
  let copy = [...array];

  copy = copy.filter(product => product.category.id === category);

  return copy;
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const visibleUsers = getFilteredProducts(productsWithUsers, query);

  const visibleUsersByCategories = (visibleUsers, category);

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
                className={classNames({ 'is-active': query === 'all' })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  onClick={() => setQuery(user.id)}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({ 'is-active': query === user.id })}
                >
                  {user.name}
                </a>
              ))}

            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={event => setQuery(event.target.value)}
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

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}

            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => setQuery('')}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleUsers.length ? (
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
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

        </div>
      </div>
    </div>
  );
};
