/** @type {import('next').NextConfig} */
require('dotenv').config();

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["prod-metadata.s3.amazonaws.com", "ethereum.org"],
  },
};
