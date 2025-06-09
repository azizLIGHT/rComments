// ==UserScript==
// @name         rComments - Redlib Hover Comments
// @namespace   https://github.com/azizLIGHT
// @version      2.8
// @description  Quick and hassle-free traversal of Reddit comments on Redlib instances
// @author       azizLIGHT
// @match        https://redlib.catsarch.com/*
// @match        https://redlib.perennialte.ch/*
// @match        https://libreddit.privacydev.net/*
// @match        https://rl.bloat.cat/*
// @match        https://redlib.r4fo.com/*
// @match        https://redlib.ducks.party/*
// @match        https://red.ngn.tf/*
// @match        https://red.artemislena.eu/*
// @match        https://redlib.privacyredirect.com/*
// @match        https://reddit.nerdvpn.de/*
// @match        https://redlib.nadeko.net/*
// @match        https://redlib.private.coffee/*
// @match        https://redlib.4o1x5.dev/*
// @match        https://redlib.nohost.network/*
// @grant        none
// @homepageURL https://github.com/azizLIGHT/rComments
// @supportURL  https://github.com/azizLIGHT/rComments/issues
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    // CSS for the popup
    const CSS = `
        ._redlib_popup {
            position: absolute;
            background: var(--color-bg, #1a1a1b);
            border: 1px solid var(--color-border, #343536);
            border-radius: 4px;
            padding: 0;
            z-index: 9999;
            max-width: 600px;
            max-height: 500px;
            overflow-y: auto;
            overflow-x: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 12px;
            line-height: 1.3;
            display: none;
            color: var(--color-text, #d7dadc);
            box-sizing: border-box;
        }

        ._redlib_popup .comment {
            margin-bottom: 8px;
            padding: 6px;
            border-left: 2px solid var(--color-link, #0079d3);
            background: var(--color-comment-bg, rgba(255,255,255,0.05));
            border-radius: 4px;
            display: block;
            width: 100%;
            box-sizing: border-box;
        }

        ._redlib_popup .comment_header {
            margin-bottom: 4px;
            font-size: 11px;
            color: var(--color-text-muted, #818384);
            line-height: 1.2;
            display: flex;
            align-items: baseline;
            flex-wrap: nowrap;
            gap: 0;
            width: 100%;
        }

        ._redlib_popup .comment_author {
            color: var(--color-username, #0079d3);
            font-weight: normal;
            text-decoration: none;
            white-space: nowrap;
        }

        ._redlib_popup .comment_author:hover {
            text-decoration: underline;
        }

        ._redlib_popup .comment_meta_separator {
            margin: 0 4px;
            color: var(--color-text-muted, #818384);
        }

        ._redlib_popup .comment_points {
            white-space: nowrap;
        }

        ._redlib_popup .comment_time {
            white-space: nowrap;
        }

        ._redlib_popup .comment_body {
            font-size: 12px;
            line-height: 1.4;
            color: var(--color-text, #d7dadc);
            max-height: 300px;
            overflow-y: auto;
            overflow-x: hidden;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            display: block;
            width: 100%;
            clear: both;
            box-sizing: border-box;
        }

        ._redlib_popup .comment_body p {
            margin: 0 0 0.75em 0;
        }

        ._redlib_popup .comment_body p:last-child {
            margin-bottom: 0;
        }

        ._redlib_popup .comment_body blockquote {
            margin: 0.5em 0;
            padding-left: 1em;
            border-left: 3px solid var(--color-border, #343536);
            color: var(--color-text-muted, #818384);
        }

        ._redlib_popup .comment_body code {
            background: var(--color-code-bg, rgba(255,255,255,0.1));
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 0.9em;
        }

        ._redlib_popup .comment_body pre {
            background: var(--color-code-bg, rgba(255,255,255,0.1));
            padding: 8px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 0.5em 0;
            word-wrap: break-word;
            white-space: pre-wrap;
        }

        ._redlib_popup .comment_body a {
            word-break: break-all;
            overflow-wrap: break-word;
        }

        ._redlib_popup .comment_body * {
            max-width: 100%;
            box-sizing: border-box;
        }

        ._redlib_popup .replies {
            margin-left: 16px;
            margin-top: 6px;
            border-left: 1px solid var(--color-border, #343536);
            padding-left: 8px;
        }

        ._redlib_popup .reply {
            margin-bottom: 6px;
            padding: 4px;
            background: var(--color-reply-bg, rgba(255,255,255,0.02));
            border-radius: 3px;
            font-size: 11px;
        }

        ._redlib_popup .reply .comment_header {
            margin-bottom: 3px;
            font-size: 10px;
        }

        ._redlib_popup .reply .comment_body {
            font-size: 11px;
            max-height: 200px;
        }

        ._redlib_popup .next_reply {
            color: var(--color-link, #0079d3);
            cursor: pointer;
            font-size: 10px;
            margin-top: 4px;
            padding: 3px 6px;
            border-radius: 3px;
            background: var(--color-toggle-bg, rgba(255,255,255,0.05));
            display: inline-block;
            user-select: none;
            border: 1px solid transparent;
        }

        ._redlib_popup .next_reply:hover {
            background: var(--color-toggle-hover, rgba(255,255,255,0.1));
            border-color: var(--color-link, #0079d3);
        }

        ._redlib_popup .loading {
            text-align: center;
            padding: 8px 12px;
            color: var(--color-text-muted, #818384);
            font-size: 11px;
            line-height: 1.3;
            font-style: normal;
            background: var(--color-comment-bg, rgba(255,255,255,0.05));
            border-radius: 4px;
            margin: 4px;
        }

        ._redlib_popup .loading::before {
            content: "⏳ ";
            margin-right: 4px;
        }

        ._redlib_popup .error {
            color: var(--color-error, #ea0027);
            text-align: center;
            padding: 20px;
        }

        ._redlib_popup .next_comment {
            text-align: center;
            padding: 6px;
            cursor: pointer;
            color: var(--color-link, #0079d3);
            border-bottom: 1px solid var(--color-border, #343536);
            margin: 0 0 6px 0;
            user-select: none;
            position: sticky;
            top: 0;
            background: var(--color-bg, #1a1a1b);
            z-index: 1;
            font-size: 11px;
        }

        ._redlib_popup .next_comment:hover {
            background: var(--color-hover-bg, #2a2a2b);
            color: var(--color-link, #0079d3);
        }
    `;

    // Add CSS to page with proper Redlib color variables
    const finalCSS = CSS
        .replace(/var\(--color-link, #0079d3\)/g, 'var(--accent, #0079d3)')
        .replace(/var\(--color-username, #0079d3\)/g, 'var(--accent, #0079d3)');

    const style = document.createElement('style');
    style.textContent = finalCSS;
    document.head.appendChild(style);

    class RedlibCommentPreview {
        constructor() {
            // Don't run on comment pages or sorting pages
            if (this.shouldSkipPage()) {
                return;
            }

            this.popup = null;
            this.currentLink = null;
            this.currentUrl = null;
            this.currentCommentIndex = 0;
            this.comments = [];
            this.timeoutId = null;
            this.hideTimeoutId = null;
            this.cache = new Map();
            this.replyIndices = new Map();
            this.init();
        }

        shouldSkipPage() {
            const path = window.location.pathname;

            // Only skip individual comment pages: /r/subreddit/comments/...
            if (path.includes('/comments/')) {
                return true;
            }

            return false;
        }

        init() {
            this.createPopup();
            this.bindEvents();
        }

        createPopup() {
            this.popup = document.createElement('div');
            this.popup.className = '_redlib_popup';
            document.body.appendChild(this.popup);
        }

        bindEvents() {
            document.addEventListener('mouseover', (e) => {
                const commentLink = this.getCommentLink(e.target);
                if (commentLink && commentLink !== this.currentLink) {
                    this.handleMouseEnter(commentLink);
                }
            });

            document.addEventListener('mouseout', (e) => {
                const commentLink = this.getCommentLink(e.target);
                if (commentLink && !this.popup.contains(e.relatedTarget)) {
                    this.handleMouseLeave();
                }
            });

            this.popup.addEventListener('mouseenter', () => {
                this.clearHideTimeout();
            });

            this.popup.addEventListener('mouseleave', () => {
                this.hidePopup();
            });

            this.popup.addEventListener('click', (e) => {
                if (e.target.classList.contains('next_comment')) {
                    this.showNextComment();
                } else if (e.target.classList.contains('next_reply')) {
                    const commentId = e.target.getAttribute('data-comment-id');
                    const parentId = e.target.getAttribute('data-parent-id') || null;
                    this.showNextReply(commentId, parentId);
                }
            });
        }

        getCommentLink(element) {
            if (element.classList && element.classList.contains('post_comments')) {
                return element;
            }

            let parent = element.parentElement;
            let depth = 0;
            while (parent && depth < 3) {
                if (parent.classList && parent.classList.contains('post_comments')) {
                    return parent;
                }
                parent = parent.parentElement;
                depth++;
            }

            return null;
        }

        handleMouseEnter(link) {
            this.currentLink = link;
            this.clearShowTimeout();
            this.clearHideTimeout();

            const url = link.href;

            if (this.cache.has(url)) {
                const cached = this.cache.get(url);
                this.comments = cached.comments;
                this.currentCommentIndex = cached.currentIndex || 0;
                this.replyIndices = cached.replyIndices || new Map();
                this.currentUrl = url;
                this.displayComments();
                this.positionPopup(link.getBoundingClientRect());
                this.popup.style.display = 'block';
                return;
            }

            this.showLoading(link);

            this.timeoutId = setTimeout(() => {
                this.fetchAndShowPreview(link);
            }, 250);
        }

        handleMouseLeave() {
            this.clearShowTimeout();
            this.hidePopupDelayed();
        }

        clearShowTimeout() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        }

        clearHideTimeout() {
            if (this.hideTimeoutId) {
                clearTimeout(this.hideTimeoutId);
                this.hideTimeoutId = null;
            }
        }

        hidePopupDelayed() {
            this.hideTimeoutId = setTimeout(() => {
                this.hidePopup();
            }, 300);
        }

        async fetchAndShowPreview(link) {
            const url = link.href;

            this.currentUrl = url;
            this.currentCommentIndex = 0;
            this.comments = [];
            this.replyIndices = new Map();

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

                const html = await response.text();

                this.parseComments(html);
                this.cache.set(url, {
                    comments: this.comments,
                    currentIndex: this.currentCommentIndex,
                    replyIndices: new Map(this.replyIndices)
                });
                this.displayComments();
            } catch (error) {
                this.showError('Failed to load comments');
            }
        }

        showLoading(link) {
            const rect = link.getBoundingClientRect();
            this.popup.innerHTML = '<div class="loading">Loading comments...</div>';
            this.positionPopup(rect);
            this.popup.style.display = 'block';
        }

        showError(message) {
            this.popup.innerHTML = `<div class="error">${message}</div>`;
        }

        parseComments(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const commentDivs = doc.querySelectorAll('div.thread > div.comment[id]');

            this.comments = [];

            commentDivs.forEach((commentDiv, index) => {
                try {
                    const isCollapsedMod = this.isCollapsedModeratorPost(commentDiv);
                    if (isCollapsedMod && index === 0) {
                        return;
                    }

                    const comment = this.extractCommentData(commentDiv);

                    if (comment && comment.body.trim() && comment.body !== '[No content]') {
                        this.comments.push(comment);
                    }
                } catch (error) {
                    // Skip failed comments
                }
            });
        }

        countTotalReplies(comment) {
            if (!comment.replies || comment.replies.length === 0) {
                return 0;
            }

            let count = comment.replies.length;
            comment.replies.forEach(reply => {
                count += this.countTotalReplies(reply);
            });

            return count;
        }

        isCollapsedModeratorPost(commentDiv) {
            const moderatorLink = commentDiv.querySelector('.comment_author.moderator');
            const detailsElement = commentDiv.querySelector('details.comment_right');

            const isCollapsed = detailsElement && !detailsElement.hasAttribute('open');
            const isModerator = !!moderatorLink;

            return isModerator && isCollapsed;
        }

        extractCommentData(commentDiv) {
            const authorLink = commentDiv.querySelector('a.comment_author');
            let author = '[deleted]';
            if (authorLink) {
                author = authorLink.textContent.trim();
                if (author.startsWith('u/')) {
                    author = author.substring(2);
                }
            }

            const scoreElement = commentDiv.querySelector('.comment_score');
            let score = 0;
            if (scoreElement) {
                const scoreText = scoreElement.textContent.trim();
                const scoreMatch = scoreText.match(/([0-9,]+\.?[0-9]*[km]?)/i);
                if (scoreMatch) {
                    let scoreStr = scoreMatch[1].toLowerCase();
                    if (scoreStr.includes('k')) {
                        score = parseFloat(scoreStr.replace('k', '')) * 1000;
                    } else if (scoreStr.includes('m')) {
                        score = parseFloat(scoreStr.replace('m', '')) * 1000000;
                    } else {
                        score = parseInt(scoreStr.replace(/,/g, '')) || 0;
                    }
                }
            }

            const bodyDiv = commentDiv.querySelector('.comment_body .md, .comment_body');
            let body = '[No content]';

            if (bodyDiv) {
                body = bodyDiv.innerHTML;
                body = body.replace(/<script[^>]*>.*?<\/script>/gi, '');

                if (!body.includes('<')) {
                    body = `<p>${body}</p>`;
                }
            }

            const timeSpan = commentDiv.querySelector('.created, .live-timestamp');
            const timeAgo = timeSpan ? timeSpan.textContent.trim() : '';

            const replies = this.extractReplies(commentDiv);

            return {
                id: commentDiv.id,
                author: author,
                score: score,
                body: body,
                timeAgo: timeAgo,
                replies: replies
            };
        }

        extractReplies(commentDiv) {
            const replies = [];
            const repliesContainer = commentDiv.querySelector('blockquote.replies');

            if (!repliesContainer) {
                return replies;
            }

            const replyDivs = repliesContainer.querySelectorAll(':scope > div.comment[id]');

            replyDivs.forEach((replyDiv) => {
                try {
                    const reply = this.extractSingleReply(replyDiv);
                    if (reply && reply.body.trim() && reply.body !== '[No content]') {
                        replies.push(reply);
                    }
                } catch (error) {
                    // Skip failed replies
                }
            });

            return replies;
        }

        extractSingleReply(replyDiv) {
            const authorLink = replyDiv.querySelector('a.comment_author');
            let author = '[deleted]';
            if (authorLink) {
                author = authorLink.textContent.trim();
                if (author.startsWith('u/')) {
                    author = author.substring(2);
                }
            }

            const scoreElement = replyDiv.querySelector('.comment_score');
            let score = 0;
            if (scoreElement) {
                const scoreText = scoreElement.textContent.trim();
                const scoreMatch = scoreText.match(/([0-9,]+\.?[0-9]*[km]?)/i);
                if (scoreMatch) {
                    let scoreStr = scoreMatch[1].toLowerCase();
                    if (scoreStr.includes('k')) {
                        score = parseFloat(scoreStr.replace('k', '')) * 1000;
                    } else if (scoreStr.includes('m')) {
                        score = parseFloat(scoreStr.replace('m', '')) * 1000000;
                    } else {
                        score = parseInt(scoreStr.replace(/,/g, '')) || 0;
                    }
                }
            }

            const bodyDiv = replyDiv.querySelector('.comment_body .md, .comment_body');
            let body = '[No content]';

            if (bodyDiv) {
                body = bodyDiv.innerHTML;
                body = body.replace(/<script[^>]*>.*?<\/script>/gi, '');
                if (!body.includes('<')) {
                    body = `<p>${body}</p>`;
                }
            }

            const timeSpan = replyDiv.querySelector('.created, .live-timestamp');
            const timeAgo = timeSpan ? timeSpan.textContent.trim() : '';

            const nestedReplies = this.extractReplies(replyDiv);

            return {
                id: replyDiv.id,
                author: author,
                score: score,
                body: body,
                timeAgo: timeAgo,
                replies: nestedReplies
            };
        }

        displayComments() {
            if (this.comments.length === 0) {
                this.popup.innerHTML = '<div class="error">No top-level comments found</div>';
                return;
            }

            const hasMore = this.currentCommentIndex < this.comments.length - 1;

            let html = '';

            if (this.comments.length > 1) {
                if (hasMore) {
                    const remaining = this.comments.length - this.currentCommentIndex - 1;
                    html += `<div class="next_comment">▼ Show next (${remaining} more top-level comments)</div>`;
                } else {
                    const totalShown = this.currentCommentIndex + 1;
                    html += `<div class="next_comment">Showing all ${totalShown} top-level comments</div>`;
                }
            }

            for (let i = this.currentCommentIndex; i >= 0; i--) {
                if (this.comments[i]) {
                    html += this.renderComment(this.comments[i]);
                }
            }

            this.popup.innerHTML = html;
        }

        renderComment(comment) {
            const replyIndex = this.replyIndices.get(comment.id) ?? -1;

            const score = comment.score > 0 ? comment.score.toLocaleString() : comment.score;
            const scoreText = Math.abs(comment.score) === 1 ? 'point' : 'points';

            let html = `
                <div class="comment" data-comment-id="${comment.id}">
                    <div class="comment_header">
                        <a href="/user/${comment.author}" class="comment_author">u/${comment.author}</a>
                        <span class="comment_meta_separator">•</span>
                        <span class="comment_points">${score} ${scoreText}</span>
                        ${comment.timeAgo ? `<span class="comment_meta_separator">•</span><span class="comment_time">${comment.timeAgo}</span>` : ''}
                    </div>
                    <div class="comment_body">${comment.body}</div>`;

            if (comment.replies && comment.replies.length > 0) {
                const hasMoreReplies = replyIndex < comment.replies.length - 1;

                if (hasMoreReplies) {
                    const remaining = comment.replies.length - replyIndex - 1;
                    const replyText = remaining === 1 ? 'reply' : 'replies';
                    html += `
                        <div class="next_reply" data-comment-id="${comment.id}">
                            ▼ Next reply (${remaining} more ${replyText})
                        </div>`;
                }
            }

            if (comment.replies && comment.replies.length > 0 && replyIndex >= 0) {
                html += `<div class="replies" data-comment-id="${comment.id}">`;

                for (let i = replyIndex; i >= 0; i--) {
                    if (comment.replies[i]) {
                        html += this.renderReply(comment.replies[i], comment.id);
                    }
                }

                html += `</div>`;
            }

            html += `</div>`;
            return html;
        }

        renderReply(reply, parentId) {
            const score = reply.score > 0 ? reply.score.toLocaleString() : reply.score;
            const scoreText = Math.abs(reply.score) === 1 ? 'point' : 'points';

            const nestedReplyIndex = this.replyIndices.get(reply.id) ?? -1;

            let html = `
                <div class="reply" data-reply-id="${reply.id}">
                    <div class="comment_header">
                        <a href="/user/${reply.author}" class="comment_author">u/${reply.author}</a>
                        <span class="comment_meta_separator">•</span>
                        <span class="comment_points">${score} ${scoreText}</span>
                        ${reply.timeAgo ? `<span class="comment_meta_separator">•</span><span class="comment_time">${reply.timeAgo}</span>` : ''}
                    </div>
                    <div class="comment_body">${reply.body}</div>`;

            if (reply.replies && reply.replies.length > 0) {
                const hasMoreNestedReplies = nestedReplyIndex < reply.replies.length - 1;
                if (hasMoreNestedReplies) {
                    const remaining = reply.replies.length - nestedReplyIndex - 1;
                    const replyText = remaining === 1 ? 'reply' : 'replies';
                    html += `
                        <div class="next_reply" data-comment-id="${reply.id}" data-parent-id="${parentId}">
                            ▼ Next reply (${remaining} more ${replyText})
                        </div>`;
                }
            }

            if (reply.replies && reply.replies.length > 0 && nestedReplyIndex >= 0) {
                html += `<div class="replies" data-comment-id="${reply.id}">`;

                for (let i = nestedReplyIndex; i >= 0; i--) {
                    if (reply.replies[i]) {
                        html += this.renderReply(reply.replies[i], reply.id);
                    }
                }

                html += `</div>`;
            }

            html += `</div>`;
            return html;
        }

        showNextComment() {
            if (this.currentCommentIndex < this.comments.length - 1) {
                this.currentCommentIndex++;
                this.displayComments();

                if (this.currentUrl && this.cache.has(this.currentUrl)) {
                    this.cache.set(this.currentUrl, {
                        comments: this.comments,
                        currentIndex: this.currentCommentIndex,
                        replyIndices: new Map(this.replyIndices)
                    });
                }
            }
        }

        showNextReply(commentId, parentId = null) {
            let targetComment = null;

            if (parentId) {
                for (let comment of this.comments) {
                    const reply = this.findReplyById(comment, commentId);
                    if (reply) {
                        targetComment = reply;
                        break;
                    }
                }
            } else {
                targetComment = this.comments.find(c => c.id === commentId);
            }

            if (!targetComment) {
                return;
            }

            if (!targetComment.replies || targetComment.replies.length === 0) {
                return;
            }

            const currentIndex = this.replyIndices.get(commentId) ?? -1;
            const newIndex = currentIndex + 1;

            if (newIndex >= targetComment.replies.length) {
                return;
            }

            const keyToStore = String(commentId);
            this.replyIndices.set(keyToStore, newIndex);

            this.displayComments();

            if (this.currentUrl && this.cache.has(this.currentUrl)) {
                this.cache.set(this.currentUrl, {
                    comments: this.comments,
                    currentIndex: this.currentCommentIndex,
                    replyIndices: new Map(this.replyIndices)
                });
            }
        }

        findReplyById(comment, replyId) {
            if (comment.replies) {
                for (let reply of comment.replies) {
                    if (reply.id === replyId) {
                        return reply;
                    }
                    const nestedReply = this.findReplyById(reply, replyId);
                    if (nestedReply) {
                        return nestedReply;
                    }
                }
            }
            return null;
        }

        positionPopup(rect) {
            const scrollTop = window.pageYOffset;
            const scrollLeft = window.pageXOffset;

            let top = rect.bottom + scrollTop + 2;
            let left = rect.left + scrollLeft;

            if (left + 600 > window.innerWidth) {
                left = Math.max(10, window.innerWidth - 620);
            }

            this.popup.style.top = `${top}px`;
            this.popup.style.left = `${left}px`;
        }

        hidePopup() {
            this.popup.style.display = 'none';
            this.currentLink = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new RedlibCommentPreview();
        });
    } else {
        new RedlibCommentPreview();
    }
})();
