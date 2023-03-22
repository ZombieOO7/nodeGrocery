'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
	 await queryInterface.createTable('le_users', {
			user_id:{
				type: Sequelize.DataTypes.UUID,
				unique: true,
				allowNull: false,
				primaryKey:true,
			},
			name:{
				type: Sequelize.DataTypes.STRING,
				allowNull: true
			},
			register_type:{
				type: Sequelize.DataTypes.SMALLINT, //1=email,2=google,3=facebook,4=apple_id
				allowNull: true,
			},
			email:{
				type: Sequelize.DataTypes.STRING,
				unique: true,
				allowNull: true
			},
			password:{
				type: Sequelize.DataTypes.STRING,
				allowNull: true,
			},
			apple_id:{
				type: Sequelize.DataTypes.STRING,
				allowNull: true,
			},
			facebook_id:{
				type: Sequelize.DataTypes.STRING,
				allowNull: true,
			},
			google_id:{
				type: Sequelize.DataTypes.STRING,
				allowNull: true,
			},
			email_verified_at:{
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
			status:{
				type: Sequelize.DataTypes.SMALLINT, // 0=inactive,1=active
				allowNull: true,
			},
			last_active_at:{
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
			createdAt:{
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt:{
				allowNull: false,
				type: Sequelize.DATE
			},
			deletedAt:{
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			}
	});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
	await queryInterface.dropTable('le_users');
  }
};
