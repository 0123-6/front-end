/* @flow */

import type Router from '../index'
import {History} from './base'
import {pushState, replaceState} from '../util/push-state'

export class HashHistory extends History {
  constructor (router: Router, base: ?string) {
    super(router, base)
    ensureSlash()
  }

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  setupListeners () {
    if (this.listeners.length > 0) {
      return
    }
    
    const handleRoutingEvent = () => {
      if (!ensureSlash()) {
        return
      }
      this.transitionTo(getHash(), () => {})
    }
    window.addEventListener(
      'popstate',
      handleRoutingEvent
    )
    this.listeners.push(() => {
      window.removeEventListener('popstate', handleRoutingEvent)
    })
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.transitionTo(
      location,
      route => {
        pushHash(route.fullPath)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.transitionTo(
      location,
      route => {
        replaceHash(route.fullPath)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  go (n: number) {
    window.history.go(n)
  }

  ensureURL (push?: boolean) {
    const current = this.current.fullPath
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current)
    }
  }

  getCurrentLocation () {
    return getHash()
  }
}

function ensureSlash (): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

export function getHash (): string {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let href = window.location.href
  const index = href.indexOf('#')
  // empty path
  if (index < 0) return ''

  href = href.slice(index + 1)

  return href
}

function getUrl (path) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  return `${base}#${path}`
}

function pushHash (path) {
  pushState(getUrl(path))
}

function replaceHash (path) {
  replaceState(getUrl(path))
}
