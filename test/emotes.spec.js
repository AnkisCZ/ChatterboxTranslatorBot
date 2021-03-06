import test from 'ava';
import { parseEmotes } from '../emotes';

test( 'parses emotes', t => {
	[
		':egg:',
		':e-mail:',
		':video_game:',
		':non-potable_water:',
		':+1:',
		':-1:',
		':clock230:',
		':100:',
		'😀',
	].forEach( v =>
		t.is( parseEmotes( {}, v ), '' )
	)
} );

test( 'removes double colon emotes', t => {
	[
		':hello world:',
		'hello :hello world: world',
	].forEach( v =>
		t.is( parseEmotes( {}, v ), v )
	)
} );

test( 'removes various emotes from message text', t => {
	[
		[ {}, 'HENLO :egg:', 'HENLO' ],
		[ {}, 'HENLO 😀', 'HENLO' ],
		[
			{ '88': [ '0-7' ] },
			'PogChamp',
			''
		],
		[
			{ '69': [ '6-15' ] },
			'Hello BloodTrail',
			'Hello'
		],
		[
			{ '88': [ '0-7' ] },
			'PogChamp This stream',
			'This stream'
		],
		[
			{ '88': [ '0-7', '13-20' ] },
			'PogChamp WOW PogChamp',
			'WOW'
		],
		[
			{ '25': [ '0-4', '6-10', '12-16' ] },
			'Kappa Kappa Kappa',
			''
		],
		[
			{
				'25': [ '20-24' ],
				'88': [ '31-38' ],
				'58765': [ '5-15' ]
			},
			'Well NotLikeThis We Kappa Meet PogChamp Again',
			'Well We Meet Again'
		],
		[
			{
				'25': [ '12-16' ],
				'88': [ '18-25' ],
				'58765': [ '0-10' ]
			},
			'NotLikeThis Kappa PogChamp',
			''
		],
	].forEach( ( [ emoteMap, input, expected ] ) =>
		t.is( parseEmotes( emoteMap, input ), expected )
	)
} );

test( 'does not throw exception when given emote with regex chars', t => {
	[
		// Twitch emotes
		':/', ':(', ':o', ':z', 'B)', ':\\', ';)', ';p', ':p', 'R)', 'o_O',
		':D', '>(', '<3', '<3', 'R)', ':>', '<]', ':7', ':(', ':P', ';P',
		':O', ':\\', ':|', ':s', ':D', 'o_O', '>(', ':)', 'B)', ';)', '#/',
		// Testing others
		'][\\^$.|?*+)(}{',

	].forEach( ( v, i ) => {
		const emoteInfo = n =>
			( { [ 'unsafe-' + i ]: [ `${ n }-${ v.length + ( n - 1 ) }` ] } )

		t.is( parseEmotes( emoteInfo( 5 ), `xxxx ${ v } xxxx` ), 'xxxx xxxx' )
		t.is( parseEmotes( emoteInfo( 0 ), v ), '' )
	} )
} );
