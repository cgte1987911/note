module.exports={
    admin:{
        username:/^[a-z0-9]{3,32}/,
        password:/^.{6,32}$/,
        title:/^.{6,32}$/,
        /* images:/\w+\.(?!(jpe?g|png|gif|svg|ico))\b/i */
        images:/^(\w+\.(jpe?g|png|gif|ico|svg),)+$/i
    },
    web:{

    }
}