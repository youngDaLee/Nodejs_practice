/**
 * 글쓰기 관련 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2016-11-10
 * @author JD
 */

var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 스키마 정의
	var PostSchema = mongoose.Schema({
		created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now} 
	    , title : {type: String, required: true, trim: true}
	    , contents : {type: String, required: true, trim: true}
	    , writer : {type: mongoose.Schema.ObjectId, ref: 'users6'}
	    , comments : [{
	    	contents : {type: String, required: true, trim: true}
	    	, created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    	, writer : {type: mongoose.Schema.ObjectId, ref: 'users6'}
	    }]
	    , read_count : {type:Number, 'default' : 0}
	});
	
	//validate

	PostSchema.path('title').required(true, '글 제목이 없습니다' );
	PostSchema.path('contents').required(true, '글 내용이 없습니다' );


	//static 정의

	PostSchema.statics = {
		loadPost : function (oid, callback) {
			// this.findById(oid, callback);
			this.findByIdAndUpdate(oid, {$inc: {read_count:1}})
			.populate('writer', 'name email').exec(callback);

			// this.findById(oid).populate('writer', 'name email').exec(callback);
			
		}
		, findAll : function (callback) {
			// this.find({}, callback);
			this.find({})
			.populate('writer', 'name email').exec(callback);
		}
	}


	//method 정의
	PostSchema.methods = {
		savePost: function (callback) {
			var self = this;

			this.validate(function (err) {
				if(err) return callback(err, null);

				self.save(callback);
			});


		}
	}

	console.log('PostSchema 정의함.');

	return PostSchema;
};

// module.exports에 PostSchema 객체 직접 할당
module.exports = Schema;

