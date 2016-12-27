var _ = require('lodash');
var idGenerator = require('./id-generation.service.js');
var log4js = require( "log4js" );
var logger = log4js.getLogger("board.service");

logger.info("Init boardService");

// TODO Replace this memory based implementation with a MongoDB!
var boards = [];

/**
 * This function will return the message board with the requested
 * ID. If no such board exists, null will be returned.
 *
 * @param id The ID of the message board to return
 * @returns {*} The message board or null if not found
 */
function findBoard(id) {
    return _.find(boards, {id: id}) || null;
}

/**
 * This function will check if a message board with the given ID already
 * exists or not. If so, it will return true. Otherwise false.
 *
 * @param id The ID of the message board to check
 * @returns {boolean} True if a board with the given ID exists
 */
function hasBoard(id) {
    return !!findBoard(id);
}

/**
 * This function will return all messages of a board. If no such board
 * exists, null will be returned. Note that the messages might be empty,
 * so an empty array will be returned (length === 0).
 *
 * @param id The ID of the message board
 * @returns {*} The messages or null if no board found
 */
function findMessages(id) {
    var board = findBoard(id);
    if(board) {
        return board.messages;
    }
    return null;
}

function findMessage(boardId, messageId) {
    var board = findBoard(boardId);
    var requestedMessage = null;
    if(board) {
        var messages = board.messages;
        _.forEach(messages, function (message) {
            if(message.id === messageId) {
                requestedMessage = message;
            }
        });
    }
    return requestedMessage;
}

function createBoard(id) {
    var board = {
        id: id,
        date: new Date(),
        messages: []
    };
    boards.push(board);
    return board;
}

/**
 * This function will create a new message on the given message
 * board. The message will contain the text as well as a creation
 * date. The updated message board will be returned. If the no
 * board with the given ID is found, null will be returned.
 *
 * @param id The ID of the message board
 * @param text The text message
 * @returns {*} The updated message board
 */
function createMessage(id, text) {
    var board = findBoard(id);

    if(board) {

        var message = {
            text: text,
            date: new Date(),
            votes: 0,
            id: idGenerator.generateId()
        };

        board.messages.push(message);
        return message;
    }
    return null;
}

function deleteMessage(boardId, messageId) {
    var board = findBoard(boardId);
    if(board) {

        var deletedMessages = _.remove(board.messages, function(message) {
            return message.id === messageId;
        });

        // Lodash will return an array of deleted objects. However, we can
        // be sure that there is only one such message as our IDs are unique.
        // So we return the first (and only!) object of the array.
        var message = deletedMessages[0];
        return message || null; // Null or the message! Otherwise we would return
                                // undefined when no message is found.

    }
    return null;
}

function clear() {
    boards = [];
}

module.exports = {
    findBoard: findBoard,
    hasBoard: hasBoard,
    findMessage: findMessage,
    findMessages: findMessages,
    createBoard: createBoard,
    createMessage: createMessage,
    deleteMessage: deleteMessage,
    clear: clear // only for tests!
};