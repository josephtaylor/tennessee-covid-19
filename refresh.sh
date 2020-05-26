#!/usr/bin/env bash

base_path=https://www.tn.gov/content/dam/tn/health/documents/cedep/novel-coronavirus/datasets

wget ${base_path}/Public-Dataset-Daily-Case-Info.XLSX \
  -O ./src/assets/Public-Dataset-Daily-Case-Info.XLSX

wget ${base_path}/Public-Dataset-County-New.XLSX \
 -O ./src/assets/Public-Dataset-County-New.XLSX
