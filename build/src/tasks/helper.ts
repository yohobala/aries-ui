import path from 'path'
import helper from 'components-helper'

import type { TaskFunction } from 'gulp'
import type { InstallOptions } from 'components-helper'
import { ariOutput, ariPackage, getPackageManifest, projectRoot } from '../utils'
import consola from 'consola'

const reComponentName: InstallOptions['reComponentName'] = (title: string) =>
  `el-${title
    .replace(/\B([A-Z])/g, '-$1')
    .replace(/[ ]+/g, '-')
    .toLowerCase()}`

const reDocUrl: InstallOptions['reDocUrl'] = (fileName, header) => {
  const docs = 'https://element-plus.org/en-US/component/'
  const _header = header ? header.replaceAll(/\s+/g, '-').toLowerCase() : ''

  return `${docs}${fileName}.html${_header ? '#' : ''}${_header}`
}

const reWebTypesSource: InstallOptions['reWebTypesSource'] = (title) => {
  const symbol = `El${title
    .replaceAll(/-/g, ' ')
    .replaceAll(/^\w|\s+\w/g, (item) => {
      return item.trim().toUpperCase()
    })}`

  return { symbol }
}

const reAttribute: InstallOptions['reAttribute'] = (value, key) => {
  const _value = value.match(/^\*\*(.*)\*\*$/)
  const str = _value ? _value[1] : value

  if (key === 'Name' && /^(-|—)$/.test(str)) {
    return 'default'
  } else if (str === '' || /^(-|—)$/.test(str)) {
    return undefined
  } else if (key === 'Attribute' && /v-model:(.+)/.test(str)) {
    const _str = str.match(/v-model:(.+)/)
    return _str ? _str[1] : undefined
  } else if (key === 'Attribute' && /v-model/.test(str)) {
    return 'model-value'
  } else if (key === 'Attribute') {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
  } else if (key === 'Type') {
    return str
      .replace(/\s*\/\s*/g, '|')
      .replace(/\s*,\s*/g, '|')
      .replace(/\(.*\)/g, '')
      .toLowerCase()
  } else if (key === 'Accepted Values') {
    return /\[.+\]\(.+\)/.test(str) || /^\*$/.test(str)
      ? undefined
      : str.replace(/`/g, '')
  } else if (key === 'Subtags') {
    return str
      ? `el-${str
        .replaceAll(/\s*\/\s*/g, '/el-')
        .replaceAll(/\B([A-Z])/g, '-$1')
        .replaceAll(/\s+/g, '-')
        .toLowerCase()}`
      : undefined
  } else {
    return str
  }
}

export const buildHelper: TaskFunction = (done) => {
  const { name, version } = getPackageManifest(ariPackage)
  consola.info(`run: ${name}${version}`)
  const tagVer = process.env.TAG_VERSION
  consola.info(`run: ${tagVer}`)
  const _version = tagVer
    ? tagVer.startsWith('v')
      ? tagVer.slice(1)
      : tagVer
    : version!
  consola.info(`run: ${{
    name: name!,
    version: _version,
    entry: `${path.resolve(
      projectRoot,
      'docs/en-US/component'
    )}/!(datetime-picker|message-box|message).md`,
    outDir: ariOutput,
    reComponentName,
    reDocUrl,
    reWebTypesSource,
    reAttribute,
    props: 'Attributes',
    propsName: 'Attribute',
    propsOptions: 'Accepted Values',
    eventsName: 'Event Name',
    tableRegExp:
      '#+\\s+(.*\\s*Attributes|.*\\s*Events|.*\\s*Slots|.*\\s*Directives)\\s*\\n+(\\|?.+\\|.+)\\n\\|?\\s*:?-+:?\\s*\\|.+((\\n\\|?.+\\|.+)+)',
  }}`)
  helper({
    name: name!,
    version: _version,
    entry: `${path.resolve(
      projectRoot,
      'docs/en-US/component'
    )}/!(datetime-picker|message-box|message).md`,
    outDir: ariOutput,
    reComponentName,
    reDocUrl,
    reWebTypesSource,
    reAttribute,
    props: 'Attributes',
    propsName: 'Attribute',
    propsOptions: 'Accepted Values',
    eventsName: 'Event Name',
    tableRegExp:
      '#+\\s+(.*\\s*Attributes|.*\\s*Events|.*\\s*Slots|.*\\s*Directives)\\s*\\n+(\\|?.+\\|.+)\\n\\|?\\s*:?-+:?\\s*\\|.+((\\n\\|?.+\\|.+)+)',
  })

  done()
}
